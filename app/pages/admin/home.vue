<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { useAdminApplicationStore } from "~/stores/application.store";
import { useAnalyticsStore } from "~/stores/analytics.store";
import type { Application } from "~/types/application";

definePageMeta({
	layout: "admin",
});

const applicationStore = useAdminApplicationStore();
const analyticsStore = useAnalyticsStore();

const isRefreshing = ref(false);

// APPLICATION STATISTICS
const totalApplications = computed<number | null>(() => {
	return applicationStore.meta?.total ?? null;
});

function metricValue(
	metric: "pending_applications" | "approved_applications" | "approved_scholars",
): number | null {
	const value = analyticsStore.results[metric]?.result?.value;

	if (typeof value === "number" && Number.isFinite(value)) {
		return value;
	}

	return null;
}

const pendingApplications = computed(() => metricValue("pending_applications"));

const approvedApplications = computed(() => metricValue("approved_applications"));

const approvedScholars = computed(() => metricValue("approved_scholars"));

// SUMMARY CARDS
const summaryCards = computed(() => [
	{
		label: "Total Applications",
		value: totalApplications.value,
		description: "Scholarship applications received",
		icon: "i-lucide-files",
		color: "text-blue-600 dark:text-blue-400",
		background: "bg-blue-50 dark:bg-blue-950/40",
	},
	{
		label: "Pending Applications",
		value: pendingApplications.value,
		description: "Applications awaiting review",
		icon: "i-lucide-clock-3",
		color: "text-amber-600 dark:text-amber-400",
		background: "bg-amber-50 dark:bg-amber-950/40",
	},
	{
		label: "Approved Applications",
		value: approvedApplications.value,
		description: "Applications approved",
		icon: "i-lucide-clipboard-check",
		color: "text-emerald-600 dark:text-emerald-400",
		background: "bg-emerald-50 dark:bg-emerald-950/40",
	},
	{
		label: "Approved Scholars",
		value: approvedScholars.value,
		description: "Recorded scholarship recipients",
		icon: "i-lucide-graduation-cap",
		color: "text-violet-600 dark:text-violet-400",
		background: "bg-violet-50 dark:bg-violet-950/40",
	},
]);

// RECENT APPLICATIONS
const recentApplications = computed<Application[]>(() => {
	return [...applicationStore.items]
		.sort((a, b) => {
			const dateA = a.createdAt ? Date.parse(a.createdAt) || 0 : 0;

			const dateB = b.createdAt ? Date.parse(b.createdAt) || 0 : 0;

			return dateB - dateA;
		})
		.slice(0, 5);
});

// STATUS OVERVIEW
type StatusColor = "warning" | "success";

interface StatusItem {
	label: string;
	value: number | null;
	color: StatusColor;
	percentage: number;
}

const statusBreakdown = computed<StatusItem[]>(() => {
	const total = totalApplications.value;
	const pending = pendingApplications.value;
	const approved = approvedApplications.value;

	function percentage(value: number | null): number {
		if (total === null || total <= 0 || value === null) {
			return 0;
		}

		return Math.min(100, Math.max(0, (value / total) * 100));
	}

	return [
		{
			label: "Pending Applications",
			value: pending,
			color: "warning",
			percentage: percentage(pending),
		},
		{
			label: "Approved Applications",
			value: approved,
			color: "success",
			percentage: percentage(approved),
		},
	];
});

// TABLE COLUMNS
const columns: TableColumn<Application>[] = [
	{
		accessorKey: "firstName",
		header: "Applicant",
	},
	{
		accessorKey: "course",
		header: "Course",
	},
	{
		accessorKey: "yearLevel",
		header: "Year Level",
	},
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		id: "actions",
		header: "Action",
	},
];

// QUICK ACTIONS
const quickActions = [
	{
		label: "Manage Applicants",
		description: "Review scholarship applications",
		icon: "i-lucide-users",
		to: "/admin/applicants",
	},
	{
		label: "Scholarship Analytics",
		description: "View scholarship statistics",
		icon: "i-lucide-chart-no-axes-combined",
		to: "/admin/applicants/analytics",
	},
	{
		label: "Recommendations",
		description: "Review applicant rankings",
		icon: "i-lucide-list-ordered",
		to: "/admin/applicants/recommendations",
	},
	{
		label: "TDP Liquidation",
		description: "Manage TDP scholarship payouts",
		icon: "i-lucide-wallet",
		to: "/admin/liquidation/tdp",
	},
];

// HELPERS
function fullName(app: Application): string {
	return [app.firstName, app.middleName, app.lastName, app.extName]
		.filter((value) => {
			if (!value) return false;

			const normalized = String(value).trim().toUpperCase();

			return !["N/A", "NONE", "NULL"].includes(normalized);
		})
		.join(" ");
}

function statusLabel(status: string): string {
	return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

type BadgeColor = "success" | "warning" | "error" | "neutral";

function statusColor(status: string): BadgeColor {
	switch (status) {
		case "approved":
		case "accepted":
			return "success";

		case "pending":
		case "under_review":
			return "warning";

		case "rejected":
			return "error";

		default:
			return "neutral";
	}
}

function formatNumber(value: number | null): string {
	return value === null ? "—" : value.toLocaleString("en-PH");
}

// FETCH BACKEND DATA
async function loadDashboard() {
	if (isRefreshing.value) return;

	isRefreshing.value = true;

	try {
		const results = await Promise.allSettled([
			applicationStore.fetchApplications(),
			analyticsStore.fetchMetrics(),
		]);

		const metricsResult = results[1];

		if (metricsResult && metricsResult.status === "fulfilled" && metricsResult.value === true) {
			await analyticsStore.fetchStatistics();
		}
	} catch (error) {
		console.error("Unable to load dashboard:", error);
	} finally {
		isRefreshing.value = false;
	}
}

onMounted(() => {
	void loadDashboard();
});
</script>

<template>
	<div class="h-full space-y-6 overflow-y-auto bg-slate-50 p-6 dark:bg-slate-950">
		<!-- HEADER -->
		<div
			class="flex flex-col gap-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="flex items-center gap-3">
				<UDashboardSidebarCollapse />

				<div>
					<h1 class="text-xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>

					<p class="text-sm text-slate-500 dark:text-slate-400">
						CPSU Scholarship Management System
					</p>
				</div>
			</div>

			<UButton
				label="Refresh Dashboard"
				icon="i-lucide-refresh-cw"
				color="neutral"
				variant="outline"
				:loading="isRefreshing"
				@click="loadDashboard"
			/>
		</div>

		<!-- SCHOLARSHIP OVERVIEW -->
		<div class="space-y-4">
			<div>
				<h2 class="text-lg font-semibold text-slate-900 dark:text-white">Scholarship Overview</h2>

				<p class="text-sm text-slate-500 dark:text-slate-400">
					Monitor scholarship applications and approval progress.
				</p>
			</div>

			<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<UCard
					v-for="card in summaryCards"
					:key="card.label"
					class="shadow-sm"
				>
					<div class="space-y-3">
						<div
							class="flex size-11 items-center justify-center rounded-xl"
							:class="card.background"
						>
							<UIcon
								:name="card.icon"
								class="size-6"
								:class="card.color"
							/>
						</div>

						<div>
							<p class="text-sm font-medium text-slate-500 dark:text-slate-400">
								{{ card.label }}
							</p>

							<p class="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
								{{ formatNumber(card.value) }}
							</p>

							<p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
								{{ card.description }}
							</p>
						</div>
					</div>
				</UCard>
			</div>
		</div>

		<!-- FRIENDLY ERROR MESSAGE -->
		<UAlert
			v-if="applicationStore.errorMessage || analyticsStore.errorMessage"
			icon="i-lucide-info"
			title="Some information is temporarily unavailable"
			description="We couldn't load all the latest scholarship records. Please refresh the dashboard or try again later."
			color="warning"
			variant="soft"
		/>

		<!-- STATUS AND QUICK ACTIONS -->
		<div class="grid gap-6 lg:grid-cols-2">
			<!-- APPLICATION STATUS -->
			<UCard class="shadow-sm">
				<div class="mb-5">
					<h2 class="font-semibold text-slate-900 dark:text-white">Application Status Overview</h2>

					<p class="text-sm text-slate-500 dark:text-slate-400">
						Track applications awaiting review and approval.
					</p>
				</div>

				<div class="space-y-6">
					<div
						v-for="status in statusBreakdown"
						:key="status.label"
						class="space-y-2"
					>
						<div class="flex items-center justify-between gap-3">
							<span class="text-sm font-medium text-slate-700 dark:text-slate-200">
								{{ status.label }}
							</span>

							<span class="text-sm font-semibold text-slate-900 dark:text-white">
								{{ formatNumber(status.value) }}
							</span>
						</div>

						<UProgress
							:model-value="status.percentage"
							:max="100"
							:color="status.color"
							size="md"
						/>
					</div>
				</div>

				<p class="mt-5 text-xs text-slate-500 dark:text-slate-400">
					Percentages are based on the total number of applications. Other application statuses may
					not be included.
				</p>
			</UCard>

			<!-- QUICK ACTIONS -->
			<UCard class="shadow-sm">
				<div class="mb-5">
					<h2 class="font-semibold text-slate-900 dark:text-white">Quick Actions</h2>

					<p class="text-sm text-slate-500 dark:text-slate-400">
						Access frequently used scholarship tools.
					</p>
				</div>

				<div class="grid gap-3 sm:grid-cols-2">
					<NuxtLink
						v-for="action in quickActions"
						:key="action.to"
						:to="action.to"
						class="group flex items-start gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-slate-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20"
					>
						<div
							class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-300"
						>
							<UIcon
								:name="action.icon"
								class="size-5"
							/>
						</div>

						<div class="min-w-0">
							<p class="text-sm font-semibold text-slate-900 dark:text-white">
								{{ action.label }}
							</p>

							<p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
								{{ action.description }}
							</p>
						</div>
					</NuxtLink>
				</div>
			</UCard>
		</div>

		<!-- RECENT APPLICATIONS -->
		<UCard class="shadow-sm">
			<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 class="font-semibold text-slate-900 dark:text-white">Recent Applications</h2>

					<p class="text-sm text-slate-500 dark:text-slate-400">
						Recent scholarship applications from available records.
					</p>
				</div>

				<UButton
					label="View All Applicants"
					icon="i-lucide-arrow-right"
					color="primary"
					variant="outline"
					to="/admin/applicants"
				/>
			</div>

			<div
				v-if="!applicationStore.isLoading && !recentApplications.length"
				class="py-10 text-center"
			>
				<UIcon
					name="i-lucide-inbox"
					class="mx-auto mb-3 size-10 text-slate-400"
				/>

				<p class="font-medium text-slate-700 dark:text-slate-200">No applications to display</p>

				<p class="mt-1 text-sm text-slate-500">
					Submitted scholarship applications will appear here.
				</p>
			</div>

			<UTable
				v-else
				:data="recentApplications"
				:columns="columns"
				:loading="applicationStore.isLoading"
				class="w-full"
			>
				<template #firstName-cell="{ row }">
					<span class="font-medium">
						{{ fullName(row.original) }}
					</span>
				</template>

				<template #course-cell="{ row }">
					{{ row.original.course?.abbreviation || row.original.course?.name || "N/A" }}
				</template>

				<template #yearLevel-cell="{ row }">
					{{ row.original.yearLevel || "N/A" }}
				</template>

				<template #status-cell="{ row }">
					<UBadge
						:color="statusColor(row.original.status)"
						variant="soft"
					>
						{{ statusLabel(row.original.status) }}
					</UBadge>
				</template>

				<template #actions-cell>
					<UButton
						label="Review"
						size="sm"
						color="primary"
						variant="soft"
						to="/admin/applicants"
					/>
				</template>
			</UTable>

			<p class="mt-4 text-xs text-slate-500 dark:text-slate-400">
				For complete application details and approval actions, visit the Applicants page.
			</p>
		</UCard>
	</div>
</template>
