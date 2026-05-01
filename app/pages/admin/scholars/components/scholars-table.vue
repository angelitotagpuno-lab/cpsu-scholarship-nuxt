<script setup lang="ts">
import { ref, h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import ScholarUpdateModal from "./scholar-update-modal.vue";
import ScholarDeleteModal from "./scholar-delete-modal.vue";

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

const showDeleteModal = ref(false);
const scholarToDelete = ref<Scholar | null>(null);

const columns: TableColumn<Scholar>[] = [
	{ accessorKey: "no", header: "No.", size: 60 },
	{ accessorKey: "lastName", header: "Last Name", size: 120 },
	{ accessorKey: "firstName", header: "First Name", size: 120 },
	{ accessorKey: "middleInitial", header: "M.I.", size: 60 },
	{
		accessorKey: "course",
		header: "Course",
		size: 150,
		cell: ({ row }) =>
			h(
				"span",
				{
					class:
						"inline-flex rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200",
				},
				row.original.course,
			),
	},
	{ accessorKey: "yearLevel", header: "Year Level", size: 120 },
	{ accessorKey: "semester", header: "Semester", size: 120 },
	{
		accessorKey: "enrolled",
		header: "Status",
		size: 140,
		cell: ({ row }) => {
			const status = row.original.enrolled;

			const className =
				status === "Enrolled"
					? "inline-flex rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
					: status === "Not Enrolled"
						? "inline-flex rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-200"
						: "inline-flex rounded bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700 dark:bg-rose-900 dark:text-rose-200";

			return h("span", { class: className }, status);
		},
	},
	{
		id: "actions",
		header: "Actions",
		size: 180,
		cell: ({ row }) => {
			const scholar = row.original;

			return h("div", { class: "flex items-center gap-2" }, [
				h(resolveComponent("UButton"), {
					label: "Update",
					size: "xs",
					color: "primary",
					variant: "soft",
					icon: "i-lucide-pencil",
					class: "shrink-0",
					onClick: () => {
						selectedScholar.value = { ...scholar };
						showModal.value = true;
					},
				}),
				h(resolveComponent("UButton"), {
					label: "Remove",
					size: "xs",
					color: "error",
					variant: "soft",
					icon: "i-lucide-trash-2",
					class: "shrink-0",
					onClick: () => {
						scholarToDelete.value = { ...scholar };
						showDeleteModal.value = true;
					},
				}),
			]);
		},
	},
];

function handleSave(updatedScholar: Scholar) {
	props.onUpdate(updatedScholar);
	showModal.value = false;
}

function handleDelete(scholar: Scholar) {
	props.onRemove(scholar);
	showDeleteModal.value = false;
	scholarToDelete.value = null;
}
</script>

<template>
	<div
		class="overflow-x-auto rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
	>
		<UTable
			:data="scholars"
			:columns="columns"
			class="min-w-[900px]"
		/>

		<ScholarUpdateModal
			:show="showModal"
			:scholar="selectedScholar"
			@close="showModal = false"
			@save="handleSave"
		/>

		<ScholarDeleteModal
			:show="showDeleteModal"
			:scholar="scholarToDelete"
			@close="showDeleteModal = false"
			@confirm="handleDelete"
		/>
	</div>
</template>
