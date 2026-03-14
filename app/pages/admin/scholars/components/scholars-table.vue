<script setup lang="ts">
import { ref, h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import ScholarUpdateModal from "./scholar-update-modal.vue"; // modal

type Scholar = {
	no: number;
	lastName: string;
	firstName: string;
	middleInitial: string;
	course: string;
	yearLevel: string;
	semester: string;
	enrolled: string;
};

const props = defineProps<{
	scholars: Scholar[];
	onRemove: (scholar: Scholar) => void;
	onUpdate: (scholar: Scholar) => void;
}>();

const showModal = ref(false);
const selectedScholar = ref<Scholar | null>(null);

const columns: TableColumn<Scholar>[] = [
	{ accessorKey: "no", header: "No.", size: 60 },
	{ accessorKey: "lastName", header: "Last Name", size: 120 },
	{ accessorKey: "firstName", header: "First Name", size: 120 },
	{ accessorKey: "middleInitial", header: "M.I.", size: 60 },
	{ accessorKey: "course", header: "Course", size: 150 },
	{ accessorKey: "yearLevel", header: "Year Level", size: 120 },
	{ accessorKey: "semester", header: "Semester", size: 120 },
	{
		accessorKey: "enrolled",
		header: "Status",
		size: 120,
		cell: ({ row }) => row.original.enrolled,
	},
	{
		id: "actions",
		header: "Actions",
		size: 180,
		cell: ({ row }) => {
			const scholar = row.original;
			return h(
				"div",
				{
					class: "action-buttons flex gap-2",
				},
				[
					h(resolveComponent("UButton"), {
						label: "Update",
						size: "xs",
						color: "primary",
						variant: "outline",
						class: "px-3 py-1 text-center flex-none",
						onClick: () => {
							selectedScholar.value = { ...scholar };
							showModal.value = true;
						},
					}),
					h(resolveComponent("UButton"), {
						label: "Remove",
						size: "xs",
						color: "error",
						variant: "outline",
						class: "px-3 py-1 text-center flex-none",
						onClick: () => {
							// Ask for confirmation before removing
							if (
								confirm(`Are you sure you want to remove ${scholar.firstName} ${scholar.lastName}?`)
							) {
								props.onRemove(scholar);
							}
						},
					}),
				],
			);
		},
	},
];

function handleSave(updatedScholar: Scholar) {
	props.onUpdate(updatedScholar);
	showModal.value = false;
}
</script>

<template>
	<div class="border rounded-lg overflow-x-auto">
		<UTable
			:data="scholars"
			:columns="columns"
			class="min-w-[800px]"
		/>

		<ScholarUpdateModal
			:show="showModal"
			:scholar="selectedScholar"
			@close="showModal = false"
			@save="handleSave"
		/>
	</div>
</template>

<style scoped>
/* === Fix alignment of buttons inside UTable cells === */
.ut-table td > .action-buttons {
	display: flex !important;
	align-items: center !important;
	justify-content: center !important;
	height: 100% !important;
}
</style>
