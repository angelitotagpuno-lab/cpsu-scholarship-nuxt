<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { useAdminApplicationStore } from "~/stores/application.store";
import { useScholarshipStore } from "~/stores/scholarship.store";
import type { Application } from "~/types/application";

definePageMeta({ layout: "admin" });

type ApplicantTab = "overall" | "tdp" | "tes";
type ActionType = "accept" | "reject" | "delete" | "bulk";

const store = useAdminApplicationStore();
const scholarshipStore = useScholarshipStore();
const toast = useToast();

const activeTab = ref<ApplicantTab>("overall");
const selected = ref<Application | null>(null);
const showModal = ref(false);
const search = ref("");
const selectedIds = ref<string[]>([]);
const confirmAction = ref<ActionType | null>(null);

const columns: TableColumn<Application>[] = [
	{ accessorKey: "firstName", header: "Name" },
	{ id: "program", header: "Scholarship Program" },
	{ accessorKey: "course", header: "Course" },
	{ accessorKey: "yearLevel", header: "Year Level" },
	{ accessorKey: "status", header: "Status" },
	{ id: "actions", header: "Actions" },
];

const totalRecords = computed(() => store.meta?.total ?? 0);
const currentPage = computed(() => store.meta?.page ?? 1);
const totalPages = computed(() => store.meta?.totalPages ?? 0);

// Match program ID from the application's offering.
function getProgramName(app: Application): string {
	const embeddedName = app.offering?.scholarshipProgram?.name;

	if (embeddedName) return embeddedName;

	const programId = app.offering?.scholarshipProgramId;

	if (!programId) return "Unknown";

	const program = scholarshipStore.items.find((item) => item.id === programId);

	return program?.name ?? "Unknown";
}

function getProgramType(app: Application): "tdp" | "tes" | "unknown" {
	const name = getProgramName(app).toLowerCase().trim();

	if (name === "tdp" || name.includes("tulong dunong")) {
		return "tdp";
	}

	if (name === "tes" || name.includes("tertiary education subsidy")) {
		return "tes";
	}

	return "unknown";
}

// These filters operate on the current API page.
const tdpApplications = computed(() => store.items.filter((app) => getProgramType(app) === "tdp"));

const tesApplications = computed(() => store.items.filter((app) => getProgramType(app) === "tes"));

const unknownApplications = computed(() =>
	store.items.filter((app) => getProgramType(app) === "unknown"),
);

const filteredApplications = computed(() => {
	switch (activeTab.value) {
		case "tdp":
			return tdpApplications.value;
		case "tes":
			return tesApplications.value;
		default:
			return store.items;
	}
});

const pendingApplications = computed(() =>
	filteredApplications.value.filter((app) => app.status === "pending"),
);

const allPendingSelected = computed(
	() =>
		pendingApplications.value.length > 0 &&
		pendingApplications.value.every((app) => selectedIds.value.includes(app.id)),
);

const tabTitle = computed(() => {
	switch (activeTab.value) {
		case "tdp":
			return "TDP Applicants";
		case "tes":
			return "TES Applicants";
		default:
			return "All Scholarship Applicants";
	}
});

const tabs = computed(() => [
	{
		value: "overall" as const,
		label: "Overall Applicants",
		count: store.items.length,
	},
	{
		value: "tdp" as const,
		label: "TDP Applicants",
		count: tdpApplications.value.length,
	},
	{
		value: "tes" as const,
		label: "TES Applicants",
		count: tesApplications.value.length,
	},
]);

onMounted(async () => {
	const results = await Promise.all([
		store.fetchApplications(),
		scholarshipStore.fetchAll({
			page: 1,
			perPage: 100,
		}),
	]);

	if (!results[1]) {
		toast.add({
			title: "Unable to load scholarship programs",
			description: scholarshipStore.error ?? "Some applicants may have an unknown program.",
			color: "warning",
		});
	}
});

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

function getProgramColor(app: Application) {
	switch (getProgramType(app)) {
		case "tdp":
			return "info";
		case "tes":
			return "success";
		default:
			return "neutral";
	}
}

function changeTab(tab: ApplicantTab) {
	activeTab.value = tab;
	selectedIds.value = [];
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

async function refreshApplications() {
	selectedIds.value = [];
	await Promise.all([
		store.fetchApplications(),
		scholarshipStore.fetchAll({
			page: 1,
			perPage: 100,
		}),
	]);
}

function toggleSelected(id: string, checked: boolean) {
	if (checked) {
		if (!selectedIds.value.includes(id)) {
			selectedIds.value.push(id);
		}
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
						View and manage TDP and TES scholarship applications
					</p>
				</div>
			</div>
		</div>

		<!-- PROGRAM FILTER TABS -->
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
			<UButton
				v-for="tab in tabs"
				:key="tab.value"
				:color="activeTab === tab.value ? 'primary' : 'neutral'"
				:variant="activeTab === tab.value ? 'solid' : 'outline'"
				size="lg"
				block
				class="justify-between"
				@click="changeTab(tab.value)"
			>
				<span>{{ tab.label }}</span>

				<UBadge
					:color="activeTab === tab.value ? 'neutral' : 'primary'"
					variant="soft"
				>
					{{ tab.count }}
				</UBadge>
			</UButton>
		</div>

		<!-- TABLE CARD -->
		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 class="font-semibold text-slate-900 dark:text-white">
						{{ tabTitle }}
					</h2>

					<p class="text-sm text-slate-500 dark:text-slate-400">
						Showing {{ filteredApplications.length }} applicants on the current page
					</p>
				</div>

				<UBadge
					color="primary"
					variant="soft"
				>
					{{ totalRecords }} total records
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
					:loading="store.isLoading || scholarshipStore.loading"
					@click="refreshApplications"
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

			<UAlert
				v-if="scholarshipStore.error"
				title="Scholarship program error"
				:description="scholarshipStore.error"
				color="warning"
				variant="soft"
				class="mb-4"
			/>

			<UAlert
				v-if="unknownApplications.length"
				title="Unidentified scholarship programs"
				:description="`${unknownApplications.length} application(s) on this page could not be matched to TDP or TES. They remain visible under Overall Applicants.`"
				color="warning"
				variant="soft"
				class="mb-4"
			/>

			<!-- APPLICATION TABLE -->
			<div class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
				<div
					v-if="pendingApplications.length"
					class="flex items-center gap-2 border-b p-3 dark:border-slate-800"
				>
					<UCheckbox
						:model-value="allPendingSelected"
						@update:model-value="toggleAll($event === true)"
					/>

					<span class="text-xs text-slate-500"> Select all pending applications in this view </span>
				</div>

				<UTable
					:data="filteredApplications"
					:columns="columns"
					:loading="store.isLoading || scholarshipStore.loading"
					class="min-w-[850px]"
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

					<template #program-cell="{ row }">
						<UBadge
							:color="getProgramColor(row.original)"
							variant="soft"
						>
							{{ getProgramName(row.original) }}
						</UBadge>
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

				<div
					v-if="!store.isLoading && !scholarshipStore.loading && !filteredApplications.length"
					class="p-8 text-center text-sm text-slate-500"
				>
					No applicants found in this view on the current page.
				</div>
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
					<div class="space-y-2">
						<h3 class="font-semibold">
							{{ fullName(selected) }}
						</h3>

						<div class="flex flex-wrap gap-2">
							<UBadge
								:color="getProgramColor(selected)"
								variant="soft"
							>
								{{ getProgramName(selected) }}
							</UBadge>

							<UBadge
								:color="getStatusColor(selected.status)"
								variant="soft"
							>
								{{ selected.status }}
							</UBadge>
						</div>
					</div>

					<!-- STUDENT INFORMATION -->
					<div class="space-y-2 text-sm">
						<h3 class="font-semibold">Student Information</h3>

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

					<!-- ADDRESSES -->
					<div>
						<h3 class="mb-2 font-semibold">Addresses</h3>

						<div
							v-for="(address, index) in selected.addresses ?? []"
							:key="address.id ?? index"
							class="mb-2 rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-800"
						>
							<p class="font-medium capitalize">
								{{ address.type }}
							</p>

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

					<!-- PARENTS -->
					<div>
						<h3 class="mb-2 font-semibold">Parents</h3>

						<div
							v-for="(parent, index) in selected.parents ?? []"
							:key="parent.id ?? index"
							class="mb-2 rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-800"
						>
							<p class="font-medium capitalize">
								{{ parent.type }}
							</p>

							<p>{{ parent.firstName }} {{ parent.lastName }}</p>
							<p>Status: {{ parent.vitalStatus || "N/A" }}</p>
							<p>Occupation: {{ parent.occupation || "N/A" }}</p>
							<p>Monthly Income: {{ parent.monthlyIncome || "N/A" }}</p>
						</div>
					</div>

					<!-- ACTIONS -->
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
						<strong>
							{{
								confirmAction === "bulk"
									? "accept the selected applications"
									: confirmAction + " this application"
							}} </strong>?
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
