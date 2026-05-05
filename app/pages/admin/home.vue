<script setup lang="ts">
import { ref, computed } from "vue";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({ layout: "admin" });

// ✅ Modal setup

type Applicant = {
	firstName: string;
	lastName: string;
	gpa: number;
	eligibility: string;
};
const config = useRuntimeConfig();

async function testFetch() {
	try {
		const res = await $fetch(`${config.public.baseUrl}/api/scholarship-programs`);
		console.log("SUCCESS:", res);
		alert("Fetch OK");
	} catch (err) {
		console.error("ERROR:", err);
		alert("Fetch FAILED");
	}
}

// Example dataset
const applicants = ref<Applicant[]>([
	{ firstName: "Juan", lastName: "Dela Cruz", gpa: 1.75, eligibility: "Approved" },
	{ firstName: "Maria", lastName: "Santos", gpa: 2.1, eligibility: "Eligible" },
	{ firstName: "Pedro", lastName: "Reyes", gpa: 2.5, eligibility: "Not Eligible" },
	{ firstName: "Ana", lastName: "Lopez", gpa: 1.8, eligibility: "Approved" },
	{ firstName: "Mark", lastName: "Rivera", gpa: 1.9, eligibility: "Eligible" },
	{ firstName: "Liza", lastName: "Ramos", gpa: 2.3, eligibility: "Not Eligible" },
]);

// Metrics
const totalApplicants = computed(() => applicants.value.length);
const approvedCount = computed(
	() => applicants.value.filter((a) => a.eligibility === "Approved").length,
);
const eligibleCount = computed(
	() => applicants.value.filter((a) => a.eligibility === "Eligible").length,
);
const notEligibleCount = computed(
	() => applicants.value.filter((a) => a.eligibility === "Not Eligible").length,
);

// Speculative predictions
const predictedEligibility = ref([
	{ label: "Likely Approved", value: 4, color: "success" },
	{ label: "Likely Eligible", value: 3, color: "primary" },
	{ label: "Likely Not Eligible", value: 2, color: "error" },
]);

// Recent Applicants Table
const recentApplicants = computed(() => applicants.value.slice(0, 5));

const columns: TableColumn<Applicant>[] = [
	{ accessorKey: "lastName", header: "Last Name" },
	{ accessorKey: "firstName", header: "First Name" },
	{ accessorKey: "gpa", header: "GPA" },
	{ accessorKey: "eligibility", header: "Eligibility" },
];
</script>

<template>
	<div class="h-full overflow-y-auto bg-slate-50 p-6 space-y-6 dark:bg-slate-950">
		<!-- Header -->
		<div
			class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
		>
			<div class="flex items-center gap-3">
				<UDashboardSidebarCollapse />
				<div>
					<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard Home</h1>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Scholarship applicant overview and analytics
					</p>
				</div>
			</div>
		</div>

		<!-- Metrics -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<UCard class="border-l-4 border-l-blue-500 bg-blue-50/80 dark:bg-blue-950/30">
				<p class="text-blue-700 text-sm font-medium dark:text-blue-300">Total Applicants</p>
				<p class="text-3xl font-bold text-blue-950 dark:text-blue-100">
					{{ totalApplicants }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30">
				<p class="text-emerald-700 text-sm font-medium dark:text-emerald-300">
					Approved Applicants
				</p>
				<p class="text-3xl font-bold text-emerald-950 dark:text-emerald-100">
					{{ approvedCount }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-amber-500 bg-amber-50/80 dark:bg-amber-950/30">
				<p class="text-amber-700 text-sm font-medium dark:text-amber-300">Eligible Applicants</p>
				<p class="text-3xl font-bold text-amber-950 dark:text-amber-100">
					{{ eligibleCount }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-rose-500 bg-rose-50/80 dark:bg-rose-950/30">
				<p class="text-rose-700 text-sm font-medium dark:text-rose-300">Not Eligible Applicants</p>
				<p class="text-3xl font-bold text-rose-950 dark:text-rose-100">
					{{ notEligibleCount }}
				</p>
			</UCard>
		</div>

		<!-- Charts -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- GPA -->
			<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
				<h2 class="font-semibold mb-4 text-slate-900 dark:text-white">GPA Distribution</h2>

				<div
					v-for="applicant in applicants"
					:key="applicant.firstName + applicant.lastName"
					class="mb-4 rounded-md bg-slate-50 p-3 dark:bg-slate-800/70"
				>
					<div class="mb-2 flex items-center justify-between gap-3">
						<p class="text-sm font-medium text-slate-700 dark:text-slate-200">
							{{ applicant.firstName }} {{ applicant.lastName }}
						</p>

						<span
							class="rounded bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
						>
							{{ applicant.gpa }}
						</span>
					</div>

					<UProgress
						:value="(4 - applicant.gpa) * 25"
						color="success"
						:label="false"
					/>
				</div>
			</UCard>

			<!-- Eligibility -->
			<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
				<h2 class="font-semibold mb-4 text-slate-900 dark:text-white">Eligibility Status</h2>

				<UDonutChart
					:data="[
						{ label: 'Approved', value: approvedCount, color: 'success' },
						{ label: 'Eligible', value: eligibleCount, color: 'primary' },
						{ label: 'Not Eligible', value: notEligibleCount, color: 'error' },
					]"
					class="h-64 w-full mb-6"
				/>

				<div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/70">
					<h3 class="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
						Predicted Eligibility
					</h3>

					<UDonutChart
						:data="predictedEligibility"
						class="h-48 w-full"
					/>
				</div>
			</UCard>
		</div>

		<!-- Table -->
		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="font-semibold text-slate-900 dark:text-white">Recent Applicants</h2>

				<span
					class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200"
				>
					Latest 5
				</span>
			</div>

			<UTable
				:data="recentApplicants"
				:columns="columns"
				class="w-full min-w-[600px]"
			/>
		</UCard>
	</div>
</template>
