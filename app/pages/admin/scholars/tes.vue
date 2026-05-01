<script setup lang="ts">
import { ref, computed } from "vue";
import ScholarsTable from "./components/scholars-table.vue";
import PageHeader from "./components/page-header.vue";

definePageMeta({ layout: "admin" });

type Scholar = {
	lastName: string;
	firstName: string;
	middleInitial: string;
	course: string;
	yearLevel: string;
	semester: string;
	enrolled: string;
};

const approvedScholars = ref<Scholar[]>([
	{
		lastName: "Dela Cruz",
		firstName: "Juan",
		middleInitial: "A",
		course: "BSIT",
		yearLevel: "2",
		semester: "1st",
		enrolled: "Enrolled",
	},
	{
		lastName: "Santos",
		firstName: "Maria",
		middleInitial: "B",
		course: "BSCS",
		yearLevel: "3",
		semester: "2nd",
		enrolled: "Not Enrolled",
	},
	{
		lastName: "Reyes",
		firstName: "Pedro",
		middleInitial: "C",
		course: "BSECE",
		yearLevel: "1",
		semester: "1st",
		enrolled: "Drop",
	},
]);

const numberedScholars = computed(() =>
	approvedScholars.value.map((s, i) => ({ no: i + 1, ...s })),
);

function removeScholar(scholar: Scholar) {
	const index = approvedScholars.value.findIndex(
		(s) =>
			s.lastName === scholar.lastName &&
			s.firstName === scholar.firstName &&
			s.middleInitial === scholar.middleInitial,
	);
	if (index !== -1) approvedScholars.value.splice(index, 1);
}

function updateScholar(scholar: Scholar) {
	// This can later be hooked to a modal or API call
	console.log("Updated scholar:", scholar);
}
</script>

<template>
	<div class="h-full overflow-y-auto bg-slate-50 p-6 space-y-6 dark:bg-slate-950">
		<!-- Header -->
		<div
			class="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
		>
			<div class="flex items-center gap-3">
				<UDashboardSidebarCollapse />

				<PageHeader
					title="TES Scholars"
					description="View the list of approved applicants from the ADMIN's perspective."
				/>
			</div>
		</div>

		<!-- Summary cards -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<UCard class="border-l-4 border-l-blue-500 bg-blue-50/80 dark:bg-blue-950/30">
				<p class="text-sm font-medium text-blue-700 dark:text-blue-300">Total Scholars</p>
				<p class="mt-1 text-3xl font-bold text-blue-950 dark:text-blue-100">
					{{ approvedScholars.length }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30">
				<p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Enrolled</p>
				<p class="mt-1 text-3xl font-bold text-emerald-950 dark:text-emerald-100">
					{{ approvedScholars.filter((scholar) => scholar.enrolled === "Enrolled").length }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-rose-500 bg-rose-50/80 dark:bg-rose-950/30">
				<p class="text-sm font-medium text-rose-700 dark:text-rose-300">Not Active</p>
				<p class="mt-1 text-3xl font-bold text-rose-950 dark:text-rose-100">
					{{
						approvedScholars.filter(
							(scholar) => scholar.enrolled === "Not Enrolled" || scholar.enrolled === "Drop",
						).length
					}}
				</p>
			</UCard>
		</div>

		<!-- Table -->
		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex items-center justify-between gap-3">
				<div>
					<h2 class="font-semibold text-slate-900 dark:text-white">Scholar List</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Approved TES scholars and enrollment status.
					</p>
				</div>

				<span
					class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200"
				>
					{{ approvedScholars.length }} records
				</span>
			</div>

			<div class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
				<ScholarsTable
					:scholars="numberedScholars"
					:onRemove="removeScholar"
					:onUpdate="updateScholar"
				/>
			</div>
		</UCard>
	</div>
</template>
