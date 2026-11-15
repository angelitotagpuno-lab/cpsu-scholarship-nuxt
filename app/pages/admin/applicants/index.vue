<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { useAdminApplicationStore } from "~/stores/application.store";
import type { Application } from "~/types/application";

definePageMeta({ layout: "admin" });

const store = useAdminApplicationStore();
const toast = useToast();

const selected = ref<Application | null>(null);
const showModal = ref(false);
const search = ref("");
const selectedIds = ref<string[]>([]);

const confirmAction = ref<"accept" | "reject" | "delete" | "bulk" | null>(null);

const columns: TableColumn<Application>[] = [
	{ accessorKey: "firstName", header: "Name" },
	{ accessorKey: "course", header: "Course" },
	{ accessorKey: "yearLevel", header: "Year Level" },
	{ accessorKey: "status", header: "Status" },
	{ id: "actions", header: "Actions" },
];

const totalRecords = computed(() => store.meta?.total ?? 0);
const currentPage = computed(() => store.meta?.page ?? 1);
const totalPages = computed(() => store.meta?.totalPages ?? 0);

const pendingApplications = computed(() => store.items.filter((app) => app.status === "pending"));

const allPendingSelected = computed(
	() =>
		pendingApplications.value.length > 0 &&
		pendingApplications.value.every((app) => selectedIds.value.includes(app.id)),
);

onMounted(() => store.fetchApplications());

function fullName(app: Application) {
	return [app.firstName, app.middleName, app.lastName, app.extName].filter(Boolean).join(" ");
}

function getStatusColor(status: string) {
	switch (status) {
		case "approved":
		case "accepted":
			return "success";
		case "rejected":
			return "error";
		case "under_review":
			return "warning";
		default:
			return "neutral";
	}
}

async function openView(app: Application) {
	selected.value = null;

	const result = await store.getApplication(app.id);

	if (result) {
		selected.value = result;
		showModal.value = true;
	} else {
		toast.add({
			title: "Unable to load application",
			description: store.errorMessage ?? undefined,
			color: "error",
		});
	}
}

function requestAction(action: "accept" | "reject" | "delete") {
	confirmAction.value = action;
}

async function executeAction() {
	if (!confirmAction.value) return;

	const action = confirmAction.value;
	let success = false;

	if (action === "bulk") {
		success = await store.acceptMultiple(selectedIds.value);
	} else if (selected.value) {
		const id = selected.value.id;

		if (action === "accept") {
			success = await store.acceptApplication(id);
		} else if (action === "reject") {
			success = await store.rejectApplication(id);
		} else if (action === "delete") {
			success = await store.deleteApplication(id);
		}
	}

	if (!success) {
		toast.add({
			title: "Operation failed",
			description: store.errorMessage ?? "Please try again.",
			color: "error",
		});
		return;
	}

	toast.add({
		title: "Success",
		description: "Application operation completed successfully.",
		color: "success",
	});

	selectedIds.value = [];
	confirmAction.value = null;
	showModal.value = false;
	selected.value = null;
}

async function handleSearch() {
	store.query.page = 1;
	store.query.search = search.value.trim();
	selectedIds.value = [];
	await store.fetchApplications();
}

async function changePage(page: number) {
	store.query.page = page;
	selectedIds.value = [];
	await store.fetchApplications();
}

function toggleSelected(id: string, checked: boolean) {
	if (checked) {
		if (!selectedIds.value.includes(id)) selectedIds.value.push(id);
	} else {
		selectedIds.value = selectedIds.value.filter((value) => value !== id);
	}
}

function toggleAll(checked: boolean) {
	selectedIds.value = checked ? pendingApplications.value.map((app) => app.id) : [];
}
</script>

<template>
	<div class="h-full space-y-6 overflow-y-auto bg-slate-50 p-6 dark:bg-slate-950">
		<!-- PAGE HEADER -->
		<div
			class="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
		>
			<div class="flex items-center gap-3">
				<UDashboardSidebarCollapse />

				<div>
					<h1 class="text-xl font-bold text-slate-900 dark:text-white">Applicants</h1>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						View and manage scholarship applications
					</p>
				</div>
			</div>
		</div>

		<!-- TABLE CARD -->
		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 class="font-semibold text-slate-900 dark:text-white">Application List</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						TDP and TES applicants with status tracking
					</p>
				</div>

				<UBadge
					color="success"
					variant="soft"
				>
					{{ totalRecords }} records
				</UBadge>
			</div>

			<!-- SEARCH AND ACTIONS -->
			<div class="mb-4 flex flex-wrap items-center gap-2">
				<UInput
					v-model="search"
					icon="i-lucide-search"
					placeholder="Search applicants..."
					class="w-full sm:max-w-sm"
					@keyup.enter="handleSearch"
				/>

				<UButton
					label="Search"
					color="primary"
					:loading="store.isLoading"
					@click="handleSearch"
				/>

				<UButton
					label="Refresh"
					icon="i-lucide-refresh-cw"
					color="neutral"
					variant="outline"
					:loading="store.isLoading"
					@click="store.fetchApplications()"
				/>

				<UButton
					v-if="selectedIds.length"
					:label="`Accept Selected (${selectedIds.length})`"
					color="success"
					@click="confirmAction = 'bulk'"
				/>
			</div>

			<UAlert
				v-if="store.errorMessage"
				title="Application error"
				:description="store.errorMessage"
				color="error"
				variant="soft"
				class="mb-4"
			/>

			<div class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
				<div
					v-if="pendingApplications.length"
					class="flex items-center gap-2 border-b p-3 dark:border-slate-800"
				>
					<UCheckbox
						:model-value="allPendingSelected"
						@update:model-value="toggleAll($event === true)"
					/>
					<span class="text-xs text-slate-500"> Select all pending applications on this page </span>
				</div>

				<UTable
					:data="store.items"
					:columns="columns"
					:loading="store.isLoading"
					class="min-w-[700px]"
				>
					<template #firstName-cell="{ row }">
						<div class="flex items-center gap-3">
							<UCheckbox
								v-if="row.original.status === 'pending'"
								:model-value="selectedIds.includes(row.original.id)"
								@update:model-value="toggleSelected(row.original.id, $event === true)"
							/>
							<span>{{ fullName(row.original) }}</span>
						</div>
					</template>

					<template #course-cell="{ row }">
						{{ row.original.course?.abbreviation || row.original.course?.name || "N/A" }}
					</template>

					<template #yearLevel-cell="{ row }">
						{{ row.original.yearLevel || "N/A" }}
					</template>

					<template #status-cell="{ row }">
						<UBadge
							:color="getStatusColor(row.original.status)"
							variant="soft"
						>
							{{ row.original.status }}
						</UBadge>
					</template>

					<template #actions-cell="{ row }">
						<UButton
							label="View"
							size="sm"
							color="primary"
							variant="soft"
							@click="openView(row.original)"
						/>
					</template>
				</UTable>
			</div>

			<!-- PAGINATION -->
			<div
				v-if="totalPages > 1"
				class="mt-4 flex items-center justify-between"
			>
				<p class="text-sm text-slate-500">Page {{ currentPage }} of {{ totalPages }}</p>

				<div class="flex gap-2">
					<UButton
						label="Previous"
						color="neutral"
						variant="outline"
						:disabled="!store.meta?.hasPrev || store.isLoading"
						@click="changePage(currentPage - 1)"
					/>
					<UButton
						label="Next"
						color="neutral"
						variant="outline"
						:disabled="!store.meta?.hasNext || store.isLoading"
						@click="changePage(currentPage + 1)"
					/>
				</div>
			</div>
		</UCard>

		<!-- APPLICATION DETAILS -->
		<UModal
			v-model:open="showModal"
			title="Application Details"
		>
			<template #body>
				<div
					v-if="selected"
					class="max-h-[70vh] space-y-5 overflow-y-auto"
				>
					<div>
						<h3 class="font-semibold">{{ fullName(selected) }}</h3>
						<UBadge
							:color="getStatusColor(selected.status)"
							variant="soft"
						>
							{{ selected.status }}
						</UBadge>
					</div>

					<div class="space-y-2 text-sm">
						<p><b>Student ID:</b> {{ selected.studentId }}</p>
						<p><b>Course:</b> {{ selected.course?.name || "N/A" }}</p>
						<p><b>Year Level:</b> {{ selected.yearLevel || "N/A" }}</p>
						<p><b>GWA:</b> {{ selected.gwa || "N/A" }}</p>
						<p><b>Birthdate:</b> {{ selected.birthdate || "N/A" }}</p>
						<p><b>Birthplace:</b> {{ selected.birthplace || "N/A" }}</p>
						<p><b>Gender:</b> {{ selected.gender || "N/A" }}</p>
						<p><b>Citizenship:</b> {{ selected.citizenship || "N/A" }}</p>
						<p><b>Email:</b> {{ selected.email || "N/A" }}</p>
						<p><b>Contact:</b> {{ selected.contactNumber || "N/A" }}</p>
						<p><b>School:</b> {{ selected.schoolName || "N/A" }}</p>
						<p><b>School Year:</b> {{ selected.offering?.schoolYear || "N/A" }}</p>
					</div>

					<div>
						<h3 class="mb-2 font-semibold">Addresses</h3>
						<div
							v-for="(address, index) in selected.addresses ?? []"
							:key="address.id ?? index"
							class="mb-2 rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-800"
						>
							<p class="font-medium capitalize">{{ address.type }}</p>
							<p>
								{{
									[
										address.street,
										address.barangay,
										address.cityMunicipality,
										address.province,
										address.zipCode,
									]
										.filter(Boolean)
										.join(", ")
								}}
							</p>
						</div>
					</div>

					<div>
						<h3 class="mb-2 font-semibold">Parents</h3>
						<div
							v-for="(parent, index) in selected.parents ?? []"
							:key="parent.id ?? index"
							class="mb-2 rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-800"
						>
							<p class="font-medium capitalize">{{ parent.type }}</p>
							<p>{{ parent.firstName }} {{ parent.lastName }}</p>
							<p>Status: {{ parent.vitalStatus || "N/A" }}</p>
							<p>Occupation: {{ parent.occupation || "N/A" }}</p>
							<p>Monthly Income: {{ parent.monthlyIncome || "N/A" }}</p>
						</div>
					</div>

					<div class="flex flex-wrap justify-end gap-2 border-t pt-4 dark:border-slate-800">
						<UButton
							label="Close"
							color="neutral"
							variant="outline"
							@click="showModal = false"
						/>
						<UButton
							label="Delete"
							color="error"
							variant="soft"
							@click="requestAction('delete')"
						/>
						<template v-if="selected.status === 'pending' || selected.status === 'under_review'">
							<UButton
								label="Reject"
								color="error"
								@click="requestAction('reject')"
							/>
							<UButton
								label="Accept"
								color="success"
								@click="requestAction('accept')"
							/>
						</template>
					</div>
				</div>
			</template>
		</UModal>

		<!-- CONFIRMATION -->
		<UModal
			:open="confirmAction !== null"
			title="Confirm Action"
			@update:open="if (!$event) confirmAction = null;"
		>
			<template #body>
				<div class="space-y-5">
					<p class="text-sm text-slate-600 dark:text-slate-300">
						Are you sure you want to
						<strong>{{
							confirmAction === "bulk"
								? "accept the selected applications"
								: confirmAction + " this application"
						}}</strong>?
					</p>

					<p
						v-if="confirmAction === 'delete'"
						class="text-sm text-red-600"
					>
						This action cannot be undone.
					</p>

					<div class="flex justify-end gap-2">
						<UButton
							label="Cancel"
							color="neutral"
							variant="outline"
							:disabled="store.isSaving"
							@click="confirmAction = null"
						/>
						<UButton
							label="Confirm"
							:color="
								confirmAction === 'reject' || confirmAction === 'delete' ? 'error' : 'success'
							"
							:loading="store.isSaving"
							@click="executeAction"
						/>
					</div>
				</div>
			</template>
		</UModal>
	</div>
</template>
