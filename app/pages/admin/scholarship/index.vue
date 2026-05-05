<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { h, resolveComponent, computed, ref, onMounted, watch } from "vue";

import type { ScholarshipProgram } from "~/types/scholarship";
import type { ScholarshipOffering } from "~/types/scholarship-offering";

import { useScholarshipOfferingStore } from "~/stores/scholarship-offering.store";
import { useScholarshipStore } from "~/stores/scholarship.store";

import AddOfferingModal from "./offerings/components/add-modal.vue";
import EditOfferingModal from "./offerings/components/edit-modal.vue";

import AddModal from "./components/add-modal.vue";
import EditModal from "./components/edit-modal.vue";
import DeleteModal from "./components/delete-modal.vue";

definePageMeta({ layout: "admin" });

const store = useScholarshipStore();
const offeringStore = useScholarshipOfferingStore();
const overlay = useOverlay();

// modals
const addModal = overlay.create(AddModal);
const editModal = overlay.create(EditModal);
const deleteModal = overlay.create(DeleteModal);

const addOfferingModal = overlay.create(AddOfferingModal);
const editOfferingModal = overlay.create(EditOfferingModal);

// selected program
const selectedProgram = ref<ScholarshipProgram | null>(null);

/* =========================
   PROGRAM ACTIONS
========================= */
async function openAdd() {
	const res = await addModal.open();
	if (res) await store.fetchAll();
}

async function openEdit(program: ScholarshipProgram) {
	const res = await editModal.open({ data: program });
	if (res) await store.fetchAll();
}

async function openDelete(program: ScholarshipProgram) {
	const res = await deleteModal.open({ data: program });
	if (res) await store.fetchAll();
}

/* =========================
   PROGRAM SELECT + DEBUG
========================= */
async function selectProgram(program: ScholarshipProgram) {
	selectedProgram.value = program;

	console.log("🚀 SELECTED PROGRAM:", program);

	await offeringStore.getOfferings();

	console.log("📦 RAW OFFERINGS FROM STORE:", offeringStore.offerings);

	// 🔍 row-level debug (VERY IMPORTANT)
	offeringStore.offerings.forEach((o: any, i: number) => {
		console.log(`ROW ${i}:`, {
			academicYear: o.academicYear,
			allocatedBudget: o.allocatedBudget,
			availableSlots: o.availableSlots,
			raw: o,
		});
	});
}

/* =========================
   WATCH DEBUG
========================= */
watch(selectedProgram, (val) => {
	console.log("🎯 Selected Program Changed:", val);
});

/* =========================
   OFFERING ACTIONS
========================= */
async function openAddOffering() {
	if (!selectedProgram.value) return;

	await addOfferingModal.open({
		programId: selectedProgram.value.id,
		onClose: async (res: boolean) => {
			if (res) await offeringStore.getOfferings();
		},
	});
}

async function openEditOffering(offering: any) {
	console.log("✏️ RAW CLICKED OFFERING:", offering);

	await editOfferingModal.open({
		data: {
			id: offering.id,
			programId: offering.programId,

			academicYear: offering.academicYear,
			semester: offering.semester,

			allocatedBudget: offering.allocatedBudget,
			availableSlots: offering.availableSlots,

			status: offering.status,
		},

		onClose: async (res: boolean) => {
			if (res) await offeringStore.getOfferings();
		},
	});
}

/* =========================
   FILTERED OFFERINGS + DEBUG
========================= */
const filteredOfferings = computed<ScholarshipOffering[]>(() => {
	if (!selectedProgram.value) return [];

	const list = Array.isArray(offeringStore.offerings) ? offeringStore.offerings : [];

	return list
		.filter((o: any) => {
			return (
				o.program_id === selectedProgram.value!.id || o.programId === selectedProgram.value!.id
			);
		})
		.map(
			(o: any): ScholarshipOffering => ({
				id: o.id,
				programId: o.program_id,

				// 🔥 KEEP SAME SHAPE AS TYPE
				academicYear: o.academic_year,
				semester: o.semester,

				allocatedBudget: Number(o.allocated_budget),
				availableSlots: Number(o.available_slots),

				status: o.status,
			}),
		);
});

/* =========================
   PROGRAM TABLE
========================= */
const columns: TableColumn<ScholarshipProgram>[] = [
	{ accessorKey: "code", header: "Code" },
	{ accessorKey: "name", header: "Name" },
	{ accessorKey: "default_amount_per_semester", header: "Amount" },

	{
		accessorKey: "is_active",
		header: "Status",
		cell: ({ row }) => {
			const active = row.getValue("is_active") as boolean;

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
				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "neutral",
						variant: "soft",
						onClick: () => selectProgram(p),
					},
					() => "View Offerings",
				),
			]);
		},
	},
];

/* =========================
   OFFERING TABLE (DEBUG FIXED)
========================= */
const offeringColumns: TableColumn<ScholarshipOffering>[] = [
	{
		header: "AY",
		cell: ({ row }) => {
			console.log("AY ROW:", row.original);
			return row.original.academicYear;
		},
	},
	{
		header: "Sem",
		cell: ({ row }) => row.original.semester,
	},
	{
		header: "Budget",
		cell: ({ row }) => {
			console.log("💰 BUDGET:", row.original.allocatedBudget);
			return row.original.allocatedBudget;
		},
	},
	{
		header: "Slots",
		cell: ({ row }) => {
			console.log("🎯 SLOTS:", row.original.availableSlots);
			return row.original.availableSlots ?? 0;
		},
	},

	{
		header: "Status",
		cell: ({ row }) => {
			const status = row.original.status;

			const colorMap: Record<string, string> = {
				draft: "bg-gray-100 text-gray-700",
				open: "bg-emerald-100 text-emerald-700",
				closed: "bg-yellow-100 text-yellow-700",
				archived: "bg-red-100 text-red-700",
			};

			return h("div", { class: "flex items-center gap-2" }, [
				h("span", { class: `px-2 py-1 text-xs rounded ${colorMap[status]}` }, status.toUpperCase()),
			]);
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			return h("div", { class: "flex gap-2" }, [
				h(
					resolveComponent("UButton"),
					{
						size: "xs",
						variant: "soft",
						color: "primary",
						onClick: () => openEditOffering(row.original),
					},
					() => "Edit",
				),
			]);
		},
	},
];

/* =========================
   INIT
========================= */
onMounted(() => {
	console.log("🚀 PAGE LOADED");
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

		<!-- PROGRAMS SECTION -->
		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex items-center justify-between">
				<div>
					<h2 class="font-semibold text-slate-900 dark:text-white">Scholarship Programs</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Click a program to view its offerings
					</p>
				</div>
			</div>

			<div class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
				<UTable
					:data="store.items"
					:columns="columns"
					:loading="store.loading"
				/>
			</div>
		</UCard>

		<!-- OFFERINGS SECTION -->
		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<h2 class="font-semibold text-slate-900 dark:text-white">Offerings</h2>

					<span
						v-if="selectedProgram"
						class="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
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

			<!-- EMPTY STATE -->
			<div
				v-if="!selectedProgram"
				class="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-sm text-slate-500"
			>
				Select a program to view its offerings
			</div>

			<!-- TABLE -->
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
