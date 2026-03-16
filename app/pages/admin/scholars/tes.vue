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
	<div class="p-6 space-y-6">
		<PageHeader
			title=" TES Scholars"
			description="View the list of approved applicants from the ADMIN's perspective."
		/>

		<ScholarsTable
			:scholars="numberedScholars"
			:onRemove="removeScholar"
			:onUpdate="updateScholar"
		/>
	</div>
</template>
