<script setup lang="ts">
import { computed, h, onMounted, ref, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { StudentAllowlist } from "~/types/student-allowlist";
import { useStudentAllowlistStore } from "~/stores/student-allowlist.store";

import AddModal from "./components/add-modal.vue";

definePageMeta({ layout: "admin" });

const store = useStudentAllowlistStore();
const overlay = useOverlay();

const addModal = overlay.create(AddModal);

const search = ref("");

const totalRecords = computed(() => store.meta?.total ?? 0);

const currentPage = computed(() => store.meta?.page ?? 1);

const totalPages = computed(() => store.meta?.totalPages ?? 0);

onMounted(async () => {
	await store.getRoster();
});

async function openAdd() {
	const instance = addModal.open();
	const result = await instance.result;

	if (result) {
		await store.getRoster();
	}
}

async function handleSearch() {
	await store.searchRoster(search.value);
}

async function nextPage() {
	if (store.meta?.hasNext) {
		await store.changePage(currentPage.value + 1);
	}
}

async function previousPage() {
	if (store.meta?.hasPrev) {
		await store.changePage(currentPage.value - 1);
	}
}

const columns: TableColumn<StudentAllowlist>[] = [
	{
		accessorKey: "studentNumber",
		header: "Student ID",
		cell: ({ row }) => row.original.studentNumber || "—",
	},
	{
		accessorKey: "name",
		header: "Full Name",
		cell: ({ row }) => row.original.name || "—",
	},
	{
		accessorKey: "isRegistered",
		header: "Registration Status",
		cell: ({ row }) => {
			const registered = row.original.isRegistered;

			return h(
				resolveComponent("UBadge"),
				{
					color: registered ? "success" : "warning",
					variant: "soft",
				},
				() => (registered ? "Registered" : "Not Registered"),
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Date Imported",
		cell: ({ row }) => {
			const value = row.original.createdAt;

			return value ? new Date(value).toLocaleDateString("en-PH") : "—";
		},
	},
];
</script>

<template>
	<div class="h-full overflow-y-auto bg-slate-50 p-6 space-y-6 dark:bg-slate-950">
		<!-- HEADER -->
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
				label="Import CSV / Excel"
				icon="i-lucide-upload"
				size="lg"
				color="primary"
				class="bg-emerald-600 hover:bg-emerald-700"
				@click="openAdd"
			/>
		</div>

		<!-- TABLE -->
		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 class="font-semibold text-slate-900 dark:text-white">Roster Records</h2>

					<p class="text-sm text-slate-500 dark:text-slate-400">
						All imported student IDs from school records.
					</p>
				</div>

				<span
					class="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
				>
					{{ totalRecords }} records
				</span>
			</div>

			<!-- SEARCH -->
			<div class="mb-4 flex gap-2">
				<UInput
					v-model="search"
					placeholder="Search student ID or name..."
					icon="i-lucide-search"
					class="w-full sm:max-w-sm"
					@keyup.enter="handleSearch"
				/>

				<UButton
					label="Search"
					color="primary"
					:loading="store.isLoading"
					@click="handleSearch"
				/>
			</div>

			<!-- ERROR -->
			<UAlert
				v-if="store.errorMessage"
				color="error"
				variant="soft"
				title="Failed to load student roster"
				:description="store.errorMessage"
				class="mb-4"
			/>

			<!-- DATA TABLE -->
			<div class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
				<UTable
					:data="store.roster"
					:columns="columns"
					:loading="store.isLoading"
					class="min-w-[700px]"
				/>
			</div>

			<!-- PAGINATION -->
			<div
				v-if="totalPages > 1"
				class="mt-4 flex items-center justify-between gap-4"
			>
				<p class="text-sm text-slate-500">Page {{ currentPage }} of {{ totalPages }}</p>

				<div class="flex gap-2">
					<UButton
						label="Previous"
						icon="i-lucide-chevron-left"
						variant="outline"
						color="neutral"
						:disabled="!store.meta?.hasPrev || store.isLoading"
						@click="previousPage"
					/>

					<UButton
						label="Next"
						trailing-icon="i-lucide-chevron-right"
						variant="outline"
						color="neutral"
						:disabled="!store.meta?.hasNext || store.isLoading"
						@click="nextPage"
					/>
				</div>
			</div>
		</UCard>
	</div>
</template>
