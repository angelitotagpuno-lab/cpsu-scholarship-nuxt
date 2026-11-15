<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Personnel } from "~/types/personnel";
import { h, resolveComponent, computed, ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth.store";
import { usePersonnelStore } from "~/stores/personnel.store";

import AddModal from "./components/add-modal.vue";
import EditModal from "./components/edit-modal.vue";
import DeleteModal from "./components/delete-modal.vue";

definePageMeta({ layout: "admin" });

const overlay = useOverlay();
const addModal = overlay.create(AddModal);
const editModal = overlay.create(EditModal);
const deleteModal = overlay.create(DeleteModal);

const store = usePersonnelStore();
const authStore = useAuthStore();

// IMPORTANT:
// authStore.isAdmin includes admin, personnel, and staff.
// This page requires the actual "admin" role only.
const isAdmin = computed(() => authStore.user?.role?.toLowerCase() === "admin");

const isCheckingAccess = ref(true);

const search = ref("");
const page = computed(() => store.meta.page);

async function openAdd() {
	if (!isAdmin.value) return;
	await addModal.open();
}

async function openEdit(personnel: Personnel) {
	if (!isAdmin.value) return;
	await editModal.open({ data: personnel });
}

async function openDelete(personnel: Personnel) {
	if (!isAdmin.value) return;
	await deleteModal.open({ data: personnel });
}

async function handleSearch() {
	if (!isAdmin.value) return;

	await store.getPersonnels({
		page: 1,
		search: search.value.trim(),
	});
}

async function changePage(newPage: number) {
	if (!isAdmin.value) return;
	if (newPage < 1 || newPage > store.meta.totalPages) return;

	await store.getPersonnels({ page: newPage });
}

const columns: TableColumn<Personnel>[] = [
	{
		id: "name",
		header: "Full Name",
		cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
	},
	{
		accessorKey: "department",
		header: "Department",
	},
	{
		accessorKey: "position",
		header: "Position",
	},
	{
		accessorKey: "contactNumber",
		header: "Contact Number",
		cell: ({ row }) => row.original.contactNumber || "—",
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			const role = row.original.role;

			return h(
				"span",
				{
					class:
						"px-2 py-1 text-xs rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
				},
				role.toUpperCase(),
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Created At",
		cell: ({ row }) => {
			const date = row.original.createdAt;

			return date ? new Date(date).toLocaleDateString("en-PH") : "—";
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

// Fetch personnel records only for actual administrators.
onMounted(async () => {
	try {
		if (!authStore.user) {
			await authStore.getUser();
		}

		if (isAdmin.value) {
			await store.getPersonnels();
		}
	} finally {
		isCheckingAccess.value = false;
	}
});
</script>

<template>
	<div class="h-full space-y-6 overflow-y-auto bg-slate-50 p-6 dark:bg-slate-950">
		<!-- PAGE HEADER -->
		<div
			class="flex flex-col gap-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="flex items-center gap-3">
				<UDashboardSidebarCollapse />

				<div>
					<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Personnel</h1>

					<p class="text-sm text-slate-500 dark:text-slate-400">
						Manage registered personnel accounts.
					</p>
				</div>
			</div>

			<!-- ADMIN ONLY -->
			<UButton
				v-if="!isCheckingAccess && isAdmin"
				label="Add Personnel"
				icon="i-lucide-plus"
				size="lg"
				color="primary"
				class="bg-emerald-600 hover:bg-emerald-700"
				@click="openAdd"
			/>
		</div>

		<!-- LOADING ACCESS -->
		<div
			v-if="isCheckingAccess"
			class="flex min-h-[50vh] items-center justify-center"
		>
			<div class="flex items-center gap-3 text-slate-500">
				<UIcon
					name="i-lucide-loader-circle"
					class="size-6 animate-spin"
				/>

				<span>Checking access...</span>
			</div>
		</div>

		<!-- ADMIN VIEW -->
		<template v-else-if="isAdmin">
			<!-- STATISTICS -->
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<UCard class="border-l-4 border-l-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30">
					<p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Total Personnel</p>

					<p class="mt-1 text-3xl font-bold text-emerald-950 dark:text-emerald-100">
						{{ store.meta.total }}
					</p>
				</UCard>

				<UCard class="border-l-4 border-l-blue-500 bg-blue-50/80 dark:bg-blue-950/30">
					<p class="text-sm font-medium text-blue-700 dark:text-blue-300">Current Page Records</p>

					<p class="mt-1 text-3xl font-bold text-blue-950 dark:text-blue-100">
						{{ store.personnels.length }}
					</p>
				</UCard>

				<UCard class="border-l-4 border-l-violet-500 bg-violet-50/80 dark:bg-violet-950/30">
					<p class="text-sm font-medium text-violet-700 dark:text-violet-300">Total Pages</p>

					<p class="mt-1 text-3xl font-bold text-violet-950 dark:text-violet-100">
						{{ store.meta.totalPages }}
					</p>
				</UCard>
			</div>

			<!-- PERSONNEL TABLE -->
			<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
				<div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 class="font-semibold text-slate-900 dark:text-white">Personnel List</h2>

						<p class="text-sm text-slate-500 dark:text-slate-400">
							All registered personnel accounts in the system.
						</p>
					</div>

					<span
						class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200"
					>
						{{ store.meta.total }} records
					</span>
				</div>

				<!-- SEARCH AND REFRESH -->
				<div class="mb-4 flex flex-col gap-2 sm:flex-row">
					<UInput
						v-model="search"
						icon="i-lucide-search"
						placeholder="Search personnel..."
						class="w-full sm:max-w-sm"
						@keyup.enter="handleSearch"
					/>

					<UButton
						label="Search"
						icon="i-lucide-search"
						color="primary"
						:loading="store.isLoading"
						@click="handleSearch"
					/>

					<UButton
						label="Refresh"
						icon="i-lucide-refresh-cw"
						color="neutral"
						variant="soft"
						:loading="store.isLoading"
						@click="store.getPersonnels()"
					/>
				</div>

				<!-- ERROR -->
				<UAlert
					v-if="store.errorMessage"
					class="mb-4"
					icon="i-lucide-circle-alert"
					color="error"
					variant="soft"
					title="Unable to load personnel"
					:description="store.errorMessage"
				/>

				<!-- TABLE -->
				<div class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
					<UTable
						:loading="store.isLoading"
						:data="store.personnels"
						:columns="columns"
						class="min-w-[900px]"
					/>
				</div>

				<!-- PAGINATION -->
				<div
					v-if="store.meta.totalPages > 1"
					class="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800"
				>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Page {{ page }} of {{ store.meta.totalPages }}
					</p>

					<div class="flex gap-2">
						<UButton
							label="Previous"
							icon="i-lucide-chevron-left"
							color="neutral"
							variant="outline"
							:disabled="!store.meta.hasPrev || store.isLoading"
							@click="changePage(page - 1)"
						/>

						<UButton
							label="Next"
							trailing-icon="i-lucide-chevron-right"
							color="neutral"
							variant="outline"
							:disabled="!store.meta.hasNext || store.isLoading"
							@click="changePage(page + 1)"
						/>
					</div>
				</div>
			</UCard>
		</template>

		<!-- LIMITED ACCESS FOR PERSONNEL / STAFF -->
		<div
			v-else
			class="flex min-h-[65vh] items-center justify-center"
		>
			<div
				class="w-full max-w-lg rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
			>
				<!-- ICON -->
				<div
					class="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/30"
				>
					<UIcon
						name="i-lucide-shield-alert"
						class="size-10 text-amber-600 dark:text-amber-400"
					/>
				</div>

				<UBadge
					color="warning"
					variant="soft"
					size="lg"
				>
					Limited Access
				</UBadge>

				<h2 class="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
					Administrator Access Required
				</h2>

				<p class="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
					Your account has limited permissions. Personnel account management is restricted to system
					administrators.
				</p>

				<!-- INFORMATION -->
				<div class="mt-6 rounded-lg bg-slate-50 p-4 text-left dark:bg-slate-800/50">
					<div class="flex items-start gap-3">
						<UIcon
							name="i-lucide-info"
							class="mt-0.5 size-5 shrink-0 text-blue-500"
						/>

						<p class="text-sm text-slate-600 dark:text-slate-300">
							You can continue using other system features available to your personnel account.
						</p>
					</div>
				</div>

				<!-- RETURN -->
				<UButton
					to="/admin/home"
					label="Return to Dashboard"
					icon="i-lucide-arrow-left"
					color="primary"
					size="lg"
					block
					class="mt-6"
				/>
			</div>
		</div>
	</div>
</template>
