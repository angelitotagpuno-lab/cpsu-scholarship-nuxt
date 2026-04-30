<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Personnel } from "~/types/personnel";
import { h, resolveComponent } from "vue";

import AddModal from "./components/add-modal.vue";
import EditModal from "./components/edit-modal.vue";
import DeleteModal from "./components/delete-modal.vue";

definePageMeta({ layout: "admin" });

const overlay = useOverlay();
const addModal = overlay.create(AddModal);
const editModal = overlay.create(EditModal);
const deleteModal = overlay.create(DeleteModal);

const store = usePersonnelStore();

async function openAdd() {
	await addModal.open();
}

async function openEdit(personnel: Personnel) {
	await editModal.open({ data: personnel });
}

async function openDelete(personnel: Personnel) {
	await deleteModal.open({ data: personnel });
}

const columns: TableColumn<Personnel>[] = [
	{
		accessorKey: "id",
		header: "ID",
		cell: ({ row }) => `#${row.getValue("id")}`,
	},
	{ accessorKey: "email", header: "Email" },

	// ✅ ADDED FIRST NAME (and better display format)
	{ accessorKey: "first_name", header: "First Name" },

	{ accessorKey: "last_name", header: "Last Name" },
	{ accessorKey: "middle_name", header: "Middle Name" },

	{ accessorKey: "position", header: "Position" },

	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => (row.getValue("role") as string)?.toUpperCase(),
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
	store.getPersonnels();
});
</script>

<template>
	<div class="p-6 space-y-6">
		<div class="flex justify-between">
			<h1 class="text-2xl font-bold">Personnel</h1>

			<UButton
				icon="i-lucide-plus"
				@click="openAdd"
			>
				Add Personnel
			</UButton>
		</div>

		<UTable
			:loading="store.isLoading"
			:data="store.personnels"
			:columns="columns"
		/>
	</div>
</template>
