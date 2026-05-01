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
	{ accessorKey: "first_name", header: "First Name" },
	{ accessorKey: "last_name", header: "Last Name" },
	{ accessorKey: "middle_name", header: "Middle Name" },
	{
		accessorKey: "sex",
		header: "Gender",
		cell: ({ row }) => {
			const sex = row.getValue("sex") as string;

			return h(
				"span",
				{
					class:
						sex === "male"
							? "px-2 py-1 text-xs rounded bg-blue-100 text-blue-700"
							: sex === "female"
								? "px-2 py-1 text-xs rounded bg-pink-100 text-pink-700"
								: "px-2 py-1 text-xs rounded bg-slate-100 text-slate-700",
				},
				sex?.toUpperCase() || "—",
			);
		},
	},
	{ accessorKey: "position", header: "Position" },
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			const role = row.getValue("role") as string;

			return h(
				"span",
				{
					class:
						role === "admin"
							? "px-2 py-1 text-xs rounded bg-red-100 text-red-700"
							: role === "personnel"
								? "px-2 py-1 text-xs rounded bg-green-100 text-green-700"
								: "px-2 py-1 text-xs rounded bg-slate-100 text-slate-700",
				},
				role?.toUpperCase() || "—",
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
	store.getPersonnels();
});
</script>

<template>
	<div class="h-full overflow-y-auto bg-slate-50 p-6 space-y-6 dark:bg-slate-950">
		<div
			class="flex flex-col gap-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="flex items-center gap-3">
				<UDashboardSidebarCollapse />

				<div>
					<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Personnel</h1>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Manage personnel and administrator accounts.
					</p>
				</div>
			</div>

			<UButton
				label="Add Personnel"
				icon="i-lucide-plus"
				size="lg"
				color="primary"
				class="bg-emerald-600 hover:bg-emerald-700"
				@click="openAdd"
			/>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<UCard class="border-l-4 border-l-blue-500 bg-blue-50/80 dark:bg-blue-950/30">
				<p class="text-sm font-medium text-blue-700 dark:text-blue-300">Total Personnel</p>
				<p class="mt-1 text-3xl font-bold text-blue-950 dark:text-blue-100">
					{{ store.personnels.length }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-red-500 bg-red-50/80 dark:bg-red-950/30">
				<p class="text-sm font-medium text-red-700 dark:text-red-300">Admins</p>
				<p class="mt-1 text-3xl font-bold text-red-950 dark:text-red-100">
					{{ store.personnels.filter((personnel) => personnel.role === "admin").length }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30">
				<p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Personnel</p>
				<p class="mt-1 text-3xl font-bold text-emerald-950 dark:text-emerald-100">
					{{ store.personnels.filter((personnel) => personnel.role === "personnel").length }}
				</p>
			</UCard>
		</div>

		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex items-center justify-between gap-3">
				<div>
					<h2 class="font-semibold text-slate-900 dark:text-white">Personnel List</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						All registered personnel accounts in the system.
					</p>
				</div>

				<span
					class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200"
				>
					{{ store.personnels.length }} records
				</span>
			</div>

			<div class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
				<UTable
					:loading="store.isLoading"
					:data="store.personnels"
					:columns="columns"
					class="min-w-[900px]"
				/>
			</div>
		</UCard>
	</div>
</template>
