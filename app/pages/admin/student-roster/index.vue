<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import AddModal from "./components/add-modal.vue";
import EditModal from "./components/edit-modal.vue";
import DeleteModal from "./components/delete-modal.vue";

definePageMeta({ layout: "admin" });

const overlay = useOverlay();

const addModal = overlay.create(AddModal);
const editModal = overlay.create(EditModal);
const deleteModal = overlay.create(DeleteModal);

/* =========================
   PLACEHOLDER STORE (NO LOGIC YET)
========================= */
const store = {
	roster: [] as any[],
	isLoading: false,
};

/* =========================
   ACTIONS (UI ONLY)
========================= */
async function openAdd() {
	await addModal.open();
}

async function openEdit(row: any) {
	await editModal.open({ data: row });
}

async function openDelete(row: any) {
	await deleteModal.open({ data: row });
}

/* =========================
   TABLE COLUMNS
========================= */
const columns: TableColumn<any>[] = [
	{
		accessorKey: "studentId",
		header: "Student ID",
		cell: ({ row }) => row.getValue("studentId") ?? "—",
	},
	{
		accessorKey: "fullName",
		header: "Full Name",
		cell: ({ row }) => row.getValue("fullName") ?? "—",
	},

	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const data = row.original;

			return h("div", { class: "flex gap-2" }, [
				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "primary",
						variant: "soft",
						onClick: () => openEdit(data),
					},
					() => "Edit",
				),
				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "error",
						variant: "soft",
						onClick: () => openDelete(data),
					},
					() => "Delete",
				),
			]);
		},
	},
];
</script>

<template>
	<div class="h-full overflow-y-auto bg-slate-50 p-6 space-y-6 dark:bg-slate-950">
		<!-- HEADER (NO CARDS) -->
		<div
			class="flex flex-col gap-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="flex items-center gap-3">
				<UDashboardSidebarCollapse />

				<div>
					<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Student ID Roster</h1>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Manage imported school student IDs for login and registration.
					</p>
				</div>
			</div>

			<UButton
				label="Import CSV"
				icon="i-lucide-upload"
				size="lg"
				color="primary"
				class="bg-emerald-600 hover:bg-emerald-700"
				@click="openAdd"
			/>
		</div>

		<!-- TABLE ONLY -->
		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex items-center justify-between">
				<div>
					<h2 class="font-semibold text-slate-900 dark:text-white">Roster Records</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						All imported student IDs from school records.
					</p>
				</div>

				<span
					class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
				>
					{{ store.roster.length }} records
				</span>
			</div>

			<div class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
				<UTable
					:data="store.roster"
					:columns="columns"
					:loading="store.isLoading"
					class="min-w-[700px]"
				/>
			</div>
		</UCard>
	</div>
</template>
