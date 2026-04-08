<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Course } from "~/types/course";
import AddModal from "./components/add-modal.vue";
import EditModal from "./components/edit-modal.vue";
import DeleteModal from "./components/delete-modal.vue";

definePageMeta({ layout: "admin" });

const overlay = useOverlay();
const addModal = overlay.create(AddModal);
const editModal = overlay.create(EditModal);
const deleteModal = overlay.create(DeleteModal);

const store = useCourseStore();

async function openAdd() {
	await addModal.open();
}

async function openEdit(course: Course) {
	await editModal.open({ data: course });
}

async function openDelete(course: Course) {
	await deleteModal.open({ data: course });
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
	{
		accessorKey: "major",
		header: "Major",
		cell: ({ row }) => `${(row.getValue("major") as string).capitalize()}`,
	},
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
						color: "primary", // primary = main action
						variant: "soft",
						onClick: () => openEdit(course),
					},
					() => "Edit",
				),
				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "error", // error = destructive
						variant: "soft",
						onClick: () => openDelete(course),
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
				color="primary"
				@click="openAdd"
			/>
		</div>
		<UTable
			:loading="store.isLoading"
			:data="store.courses"
			:columns="columns"
		/>
	</div>
</template>
