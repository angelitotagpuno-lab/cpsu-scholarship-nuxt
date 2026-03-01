<script setup lang="ts">
import { ref, computed } from "vue";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({ layout: "admin" });

type Applicant = {
	firstName: string;
	lastName: string;
	gpa: number;
	eligibility: string;
};

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
	<div class="h-full overflow-y-auto p-6 space-y-6">
		<!-- Page Header -->
		<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
			<div class="flex items-center gap-3">
				<UDashboardSidebarCollapse />
				<h1 class="text-2xl font-bold">Admin Dashboard Home</h1>
			</div>

			<p class="text-gray-500 dark:text-gray-400">
				Overview of scholarship applicants and key analytics.
			</p>
		</div>

		<!-- Key Metrics Cards -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<UCard class="p-4">
				<p class="text-gray-500 text-sm">Total Applicants</p>
				<p class="text-2xl font-bold">{{ totalApplicants }}</p>
			</UCard>

			<UCard class="p-4">
				<p class="text-gray-500 text-sm">Approved Applicants</p>
				<p class="text-2xl font-bold">{{ approvedCount }}</p>
			</UCard>

			<UCard class="p-4">
				<p class="text-gray-500 text-sm">Eligible Applicants</p>
				<p class="text-2xl font-bold">{{ eligibleCount }}</p>
			</UCard>

			<UCard class="p-4">
				<p class="text-gray-500 text-sm">Not Eligible Applicants</p>
				<p class="text-2xl font-bold">{{ notEligibleCount }}</p>
			</UCard>
		</div>

		<!-- Analytics Graphs (Nuxt UI) -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- GPA Distribution -->
			<UCard class="p-4">
				<h2 class="font-semibold mb-4">GPA Distribution</h2>
				<div
					v-for="applicant in applicants"
					:key="applicant.firstName + applicant.lastName"
					class="mb-2"
				>
					<p class="text-sm font-medium">
						{{ applicant.firstName }} {{ applicant.lastName }} ({{ applicant.gpa }})
					</p>
					<UProgress
						:value="(4 - applicant.gpa) * 25"
						color="success"
						:label="false"
					/>
				</div>
			</UCard>

			<!-- Eligibility Status with Speculation -->
			<UCard class="p-4">
				<h2 class="font-semibold mb-4">Eligibility Status</h2>

				<!-- Actual Eligibility Donut -->
				<UDonutChart
					:data="[
						{ label: 'Approved', value: approvedCount, color: 'success' },
						{ label: 'Eligible', value: eligibleCount, color: 'primary' },
						{ label: 'Not Eligible', value: notEligibleCount, color: 'error' },
					]"
					class="h-64 w-full mb-6"
				/>

				<!-- Speculative Predictions -->
				<h3 class="font-medium mb-2"></h3>
				<UDonutChart
					:data="predictedEligibility"
					class="h-48 w-full"
				/>
			</UCard>
		</div>

		<!-- Recent Applicants Table -->
		<UCard class="p-4">
			<h2 class="font-semibold mb-4">Recent Applicants</h2>
			<UTable
				:data="recentApplicants"
				:columns="columns"
				class="w-full min-w-[600px]"
			/>
		</UCard>
	</div>
</template>
