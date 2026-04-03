<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Course } from "~/types/course";
import AddModal from "./components/add-modal.vue";

definePageMeta({ layout: "admin" });

const overlay = useOverlay();
const modal = overlay.create(AddModal);

const store = useCourseStore();

async function open() {
	await modal.open();
}
const columns: TableColumn<Course>[] = [
	{
		accessorKey: "id",
		header: "ID",
		cell: ({ row }) => `#${row.getValue("id")}`,
	},
	{ accessorKey: "name", header: "Name" },
	{ accessorKey: "abbreviation", header: "Abbreviation" },
	{ accessorKey: "major", header: "Major" },
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
