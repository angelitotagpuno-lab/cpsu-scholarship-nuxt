<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { h, resolveComponent } from "vue";
import type { ScholarshipProgram } from "~/types/scholarship";

import AddModal from "./components/add-modal.vue";
import EditModal from "./components/edit-modal.vue";
import DeleteModal from "./components/delete-modal.vue";

definePageMeta({ layout: "admin" });

const store = useScholarshipStore();
const overlay = useOverlay();

const addModal = overlay.create(AddModal);
const editModal = overlay.create(EditModal);
const deleteModal = overlay.create(DeleteModal);

async function openAdd() {
	await addModal.open();
}

async function openEdit(program: ScholarshipProgram) {
	await editModal.open({ data: program });
}

async function openDelete(program: ScholarshipProgram) {
	await deleteModal.open({ data: program });
}

const columns: TableColumn<ScholarshipProgram>[] = [
	{ accessorKey: "code", header: "Code" },
	{ accessorKey: "name", header: "Name" },
	{ accessorKey: "defaultAmountPerSemester", header: "Amount" },
	{
		accessorKey: "isActive",
		header: "Status",
		cell: ({ row }) => {
			const active = row.getValue("isActive") as boolean;

			return h(
				"span",
				{
					class: active
						? "px-2 py-1 text-xs rounded bg-emerald-100 text-emerald-700"
						: "px-2 py-1 text-xs rounded bg-red-100 text-red-700",
				},
				active ? "ACTIVE" : "INACTIVE",
			);
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const p = row.original;

			return h("div", { class: "flex gap-2" }, [
				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "primary",
						variant: "soft",
						onClick: () => openEdit(p),
					},
					() => "Edit",
				),
				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "error",
						variant: "soft",
						onClick: () => openDelete(p),
					},
					() => "Delete",
				),
			]);
		},
	},
];

onMounted(() => {
	store.fetchAll();
});
</script>

<template>
	<div class="p-6 space-y-6">
		<div class="flex justify-between items-center">
			<h1 class="text-2xl font-bold">Scholarship Programs</h1>
			<UButton @click="openAdd">Add Program</UButton>
		</div>

		<UTable
			:data="store.items"
			:columns="columns"
			:loading="store.loading"
		/>
	</div>
</template>
