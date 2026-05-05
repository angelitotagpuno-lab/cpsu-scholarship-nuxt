<script setup lang="ts">
import { ref, computed } from "vue";
import ScholarsTable from "./components/scholars-table.vue";
import PageHeader from "./components/page-header.vue";

definePageMeta({
	layout: "admin",
});

type Scholar = {
	id: number;
	scholarshipType: "TDP" | "TES";
	lastName: string;
	firstName: string;
	middleInitial: string;
	course: string;
	yearLevel: string;
	semester: string;
	enrolled: string;
};

const search = ref("");

const approvedScholars = ref<Scholar[]>([
	{
		id: 1,
		scholarshipType: "TDP",
		lastName: "Dela Cruz",
		firstName: "Juan",
		middleInitial: "A",
		course: "BSIT",
		yearLevel: "2",
		semester: "1st",
		enrolled: "Enrolled",
	},
	{
		id: 2,
		scholarshipType: "TES",
		lastName: "Santos",
		firstName: "Maria",
		middleInitial: "B",
		course: "BSCS",
		yearLevel: "3",
		semester: "2nd",
		enrolled: "Not Enrolled",
	},
	{
		id: 3,
		scholarshipType: "TDP",
		lastName: "Reyes",
		firstName: "Pedro",
		middleInitial: "C",
		course: "BSECE",
		yearLevel: "1",
		semester: "1st",
		enrolled: "Drop",
	},
	{
		id: 4,
		scholarshipType: "TES",
		lastName: "Garcia",
		firstName: "Ana",
		middleInitial: "D",
		course: "BSBA",
		yearLevel: "4",
		semester: "2nd",
		enrolled: "Enrolled",
	},
]);

const filteredScholars = computed(() => {
	const query = search.value.trim().toLowerCase();

	if (!query) return approvedScholars.value;

	return approvedScholars.value.filter((scholar) =>
		[
			scholar.scholarshipType,
			scholar.lastName,
			scholar.firstName,
			scholar.middleInitial,
			scholar.course,
			scholar.yearLevel,
			scholar.semester,
			scholar.enrolled,
		]
			.join(" ")
			.toLowerCase()
			.includes(query),
	);
});

const numberedScholars = computed(() =>
	filteredScholars.value.map((scholar, index) => ({
		no: index + 1,
		...scholar,
	})),
);

const totalScholars = computed(() => filteredScholars.value.length);

const totalEnrolled = computed(
	() => filteredScholars.value.filter((scholar) => scholar.enrolled === "Enrolled").length,
);

const totalNotActive = computed(
	() =>
		filteredScholars.value.filter(
			(scholar) => scholar.enrolled === "Not Enrolled" || scholar.enrolled === "Drop",
		).length,
);

function removeScholar(scholar: Scholar) {
	const index = approvedScholars.value.findIndex((s) => s.id === scholar.id);

	if (index !== -1) {
		approvedScholars.value.splice(index, 1);
	}
}

function updateScholar(updatedScholar: Scholar & { no?: number }) {
	const index = approvedScholars.value.findIndex((s) => s.id === updatedScholar.id);

	if (index !== -1) {
		const { no, ...scholar } = updatedScholar;
		approvedScholars.value[index] = scholar;
	}
}
</script>

<template>
	<div class="h-full space-y-6 overflow-y-auto bg-slate-50 p-6 dark:bg-slate-950">
		<div
			class="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
		>
			<div class="flex items-center gap-3">
				<UDashboardSidebarCollapse />

				<PageHeader
					title="Scholars"
					description="View the list of approved TDP and TES scholars from the ADMIN's perspective."
				/>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<UCard class="border-l-4 border-l-blue-500 bg-blue-50/80 dark:bg-blue-950/30">
				<p class="text-sm font-medium text-blue-700 dark:text-blue-300">Total Scholars</p>
				<p class="mt-1 text-3xl font-bold text-blue-950 dark:text-blue-100">
					{{ totalScholars }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30">
				<p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Enrolled</p>
				<p class="mt-1 text-3xl font-bold text-emerald-950 dark:text-emerald-100">
					{{ totalEnrolled }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-rose-500 bg-rose-50/80 dark:bg-rose-950/30">
				<p class="text-sm font-medium text-rose-700 dark:text-rose-300">Not Active</p>
				<p class="mt-1 text-3xl font-bold text-rose-950 dark:text-rose-100">
					{{ totalNotActive }}
				</p>
			</UCard>
		</div>

		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 class="font-semibold text-slate-900 dark:text-white">Scholar List</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Approved TDP and TES scholars and enrollment status.
					</p>
				</div>

				<div class="flex flex-col gap-2 sm:w-80">
					<UInput
						v-model="search"
						icon="i-lucide-search"
						placeholder="Search TDP, TES, name, course..."
						color="neutral"
						variant="outline"
					/>

					<span class="text-right text-xs font-medium text-slate-500 dark:text-slate-400">
						{{ totalScholars }} records
					</span>
				</div>
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
