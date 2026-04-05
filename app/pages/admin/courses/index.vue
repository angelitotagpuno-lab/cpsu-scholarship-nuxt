<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Course } from "~/types/course";
import AddModal from "./components/add-modal.vue";
import { courseService } from "~/services/course.service";

definePageMeta({ layout: "admin" });

const overlay = useOverlay();
const modal = overlay.create(AddModal);

const store = useCourseStore();

async function open() {
	await modal.open();
}

async function openEdit(course: Course) {
	await modal.open({
		isEdit: true,
		data: course,
	});
	await store.getCourses();
}

async function handleDelete(id: string) {
	try {
		await courseService.destroy(id);
		await store.getCourses();
	} catch (error) {
		console.error("Delete failed:", error);
	}
}
const columns: TableColumn<Course>[] = [
	{
		accessorKey: "id",
		header: "ID",
		cell: ({ row }) => `#${row.getValue("id")}`,
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => `${(row.getValue("name") as string).capitalize()}`,
	},
	{
		accessorKey: "abbreviation",
		header: "Abbreviation",
		cell: ({ row }) => `${(row.getValue("abbreviation") as string).toUpperCase()}`,
	},
	{ accessorKey: "major", header: "Major" },
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const course = row.original;

			return h("div", { class: "flex gap-2" }, [
				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "blue",
						variant: "soft",
						onClick: () => openEdit(course),
					},
					() => "Edit",
				),
				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "red",
						variant: "soft",
						onClick: () => handleDelete(course.id ?? row.getValue("id")),
					},
					() => "Delete",
				),
			]);
		},
	},
];

onMounted(async () => {
	await store.getCourses();
});
</script>

<template>
	<div class="p-6 space-y-6">
		<div class="flex justify-between">
			<div class="flex items-center gap-3">
				<UDashboardSidebarCollapse />
				<h1 class="text-2xl font-bold">Courses</h1>
			</div>
			<UButton
				label="Add Course"
				icon="i-lucide-plus"
				size="lg"
				@click="open"
			/>
		</div>
		<UTable
			:loading="store.isLoading"
			:data="store.courses"
			:columns="columns"
		/>
	</div>
</template>
