<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { h, resolveComponent, computed, ref, onMounted } from "vue";

import type { ScholarshipProgram } from "~/types/scholarship";
import type { ScholarshipOffering } from "~/types/scholarship-offering";

import { useScholarshipStore } from "~/stores/scholarship.store";
import { useScholarshipOfferingStore } from "~/stores/scholarship-offering.store";

import AddModal from "./components/add-modal.vue";
import EditModal from "./components/edit-modal.vue";
import DeleteModal from "./components/delete-modal.vue";

import AddOfferingModal from "./offerings/components/add-modal.vue";
import EditOfferingModal from "./offerings/components/edit-modal.vue";
import DeleteOfferingModal from "./offerings/components/delete-modal.vue";

definePageMeta({ layout: "admin" });

const store = useScholarshipStore();
const offeringStore = useScholarshipOfferingStore();
const overlay = useOverlay();

// PROGRAM MODALS
const addModal = overlay.create(AddModal);
const editModal = overlay.create(EditModal);
const deleteModal = overlay.create(DeleteModal);

// OFFERING MODALS
const addOfferingModal = overlay.create(AddOfferingModal);
const editOfferingModal = overlay.create(EditOfferingModal);
const deleteOfferingModal = overlay.create(DeleteOfferingModal);

// SELECTED PROGRAM
const selectedProgram = ref<ScholarshipProgram | null>(null);

/* =========================
   PROGRAM ACTIONS
========================= */

async function openAdd() {
	const res = await addModal.open();

	if (res) {
		await store.fetchAll();
	}
}

async function openEdit(program: ScholarshipProgram) {
	const res = await editModal.open({ data: program });

	if (res) {
		await store.fetchAll();

		if (selectedProgram.value?.id === program.id) {
			selectedProgram.value = store.items.find((p) => p.id === program.id) ?? selectedProgram.value;
		}
	}
}

async function openDelete(program: ScholarshipProgram) {
	const res = await deleteModal.open({ data: program });

	if (res) {
		if (selectedProgram.value?.id === program.id) {
			selectedProgram.value = null;
		}

		await store.fetchAll();
	}
}

/* =========================
   SELECT PROGRAM
========================= */

async function selectProgram(program: ScholarshipProgram) {
	selectedProgram.value = program;

	await offeringStore.getOfferings();

	console.log("Selected Program:", program);
	console.log("Offerings:", offeringStore.offerings);
}

/* =========================
   OFFERING ACTIONS
========================= */

async function openAddOffering() {
	if (!selectedProgram.value) return;

	const res = await addOfferingModal.open({
		programId: selectedProgram.value.id,
	});

	if (res) {
		await offeringStore.getOfferings();
	}
}

async function openEditOffering(offering: ScholarshipOffering) {
	const res = await editOfferingModal.open({
		data: offering,
	});

	if (res) {
		await offeringStore.getOfferings();
	}
}

async function openDeleteOffering(offering: ScholarshipOffering) {
	const res = await deleteOfferingModal.open({
		data: offering,
	});

	if (res) {
		await offeringStore.getOfferings();
	}
}

/* =========================
   FILTERED OFFERINGS
========================= */

const filteredOfferings = computed<ScholarshipOffering[]>(() => {
	if (!selectedProgram.value) return [];

	return offeringStore.offerings.filter(
		(offering) => offering.scholarshipProgramId === selectedProgram.value?.id,
	);
});

/* =========================
   CURRENCY FORMATTER
========================= */

function formatCurrency(value: string | number): string {
	return new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
	}).format(Number(value));
}

/* =========================
   PROGRAM TABLE
========================= */

const columns: TableColumn<ScholarshipProgram>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: ({ row }) => row.original.description || "—",
	},
	{
		accessorKey: "createdAt",
		header: "Created At",
		cell: ({ row }) => {
			const date = row.original.createdAt;

			if (!date) return "—";

			return new Date(date).toLocaleDateString("en-PH", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		},
	},
	{
		accessorKey: "isArchived",
		header: "Status",
		cell: ({ row }) => {
			const active = !row.original.isArchived;

			return h(
				"span",
				{
					class: active
						? "px-2 py-1 text-xs rounded bg-emerald-100 text-emerald-700"
						: "px-2 py-1 text-xs rounded bg-red-100 text-red-700",
				},
				active ? "ACTIVE" : "ARCHIVED",
			);
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const program = row.original;

			return h("div", { class: "flex gap-2" }, [
				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "primary",
						variant: "soft",
						onClick: () => openEdit(program),
					},
					() => "Edit",
				),
				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "error",
						variant: "soft",
						onClick: () => openDelete(program),
					},
					() => "Delete",
				),
				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "neutral",
						variant: "soft",
						onClick: () => selectProgram(program),
					},
					() => "View Offerings",
				),
			]);
		},
	},
];

/* =========================
   OFFERING TABLE
========================= */

const offeringColumns: TableColumn<ScholarshipOffering>[] = [
	{
		accessorKey: "schoolYear",
		header: "School Year",
	},
	{
		accessorKey: "totalBudget",
		header: "Total Budget",
		cell: ({ row }) => formatCurrency(row.original.totalBudget),
	},
	{
		accessorKey: "amountPerSemester",
		header: "Per Semester",
		cell: ({ row }) => formatCurrency(row.original.amountPerSemester),
	},
	{
		accessorKey: "pwdAdditional",
		header: "PWD Additional",
		cell: ({ row }) => formatCurrency(row.original.pwdAdditional),
	},
	{
		accessorKey: "isActive",
		header: "Status",
		cell: ({ row }) => {
			const offering = row.original;

			const label = offering.isArchived ? "ARCHIVED" : offering.isActive ? "ACTIVE" : "INACTIVE";

			const color = offering.isArchived
				? "bg-red-100 text-red-700"
				: offering.isActive
					? "bg-emerald-100 text-emerald-700"
					: "bg-gray-100 text-gray-700";

			return h(
				"span",
				{
					class: `px-2 py-1 text-xs rounded ${color}`,
				},
				label,
			);
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const offering = row.original;

			return h("div", { class: "flex gap-2" }, [
				h(
					resolveComponent("UButton"),
					{
						size: "xs",
						variant: "soft",
						color: "primary",
						onClick: () => openEditOffering(offering),
					},
					() => "Edit",
				),
				h(
					resolveComponent("UButton"),
					{
						size: "xs",
						variant: "soft",
						color: "error",
						onClick: () => openDeleteOffering(offering),
					},
					() => "Delete",
				),
			]);
		},
	},
];

/* =========================
   INITIAL LOAD
========================= */

onMounted(() => {
	store.fetchAll();
});
</script>

<template>
	<div class="h-full space-y-6 overflow-y-auto bg-slate-50 p-6 dark:bg-slate-950">
		<!-- PAGE HEADER -->
		<div
			class="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
		>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<UDashboardSidebarCollapse />

					<div>
						<h1 class="text-xl font-bold text-slate-900 dark:text-white">Scholarship Management</h1>
						<p class="text-sm text-slate-500 dark:text-slate-400">
							Manage programs and their offerings
						</p>
					</div>
				</div>

				<UButton
					color="primary"
					icon="i-lucide-plus-circle"
					class="bg-emerald-600 hover:bg-emerald-700"
					@click="openAdd"
				>
					Add Program
				</UButton>
			</div>
		</div>

		<!-- SCHOLARSHIP PROGRAMS -->
		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex items-center justify-between">
				<div>
					<h2 class="font-semibold text-slate-900 dark:text-white">Scholarship Programs</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Click a program to view its offerings
					</p>
				</div>
			</div>

			<UAlert
				v-if="store.error"
				class="mb-4"
				icon="i-lucide-circle-alert"
				color="error"
				variant="soft"
				title="Scholarship Programs Error"
				:description="store.error"
			/>

			<div class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
				<UTable
					:data="store.items"
					:columns="columns"
					:loading="store.loading"
				/>
			</div>
		</UCard>

		<!-- OFFERINGS -->
		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<h2 class="font-semibold text-slate-900 dark:text-white">Offerings</h2>

					<span
						v-if="selectedProgram"
						class="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
					>
						{{ selectedProgram.name }}
					</span>
				</div>

				<UButton
					color="primary"
					icon="i-lucide-plus-circle"
					class="bg-emerald-600 hover:bg-emerald-700"
					:disabled="!selectedProgram"
					@click="openAddOffering"
				>
					Add Offering
				</UButton>
			</div>

			<!-- OFFERING API ERROR -->
			<UAlert
				v-if="offeringStore.errorMessage"
				class="mb-4"
				icon="i-lucide-circle-alert"
				color="error"
				variant="soft"
				title="Offering Error"
				:description="offeringStore.errorMessage"
			/>

			<!-- NO PROGRAM SELECTED -->
			<div
				v-if="!selectedProgram"
				class="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700"
			>
				Select a program to view its offerings
			</div>

			<!-- OFFERINGS TABLE -->
			<div
				v-else
				class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800"
			>
				<UTable
					:data="filteredOfferings"
					:columns="offeringColumns"
					:loading="offeringStore.isLoading"
				/>
			</div>
		</UCard>
	</div>
</template>
