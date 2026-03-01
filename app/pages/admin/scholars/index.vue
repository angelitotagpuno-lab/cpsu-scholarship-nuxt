<script setup lang="ts">
import { ref, computed } from "vue";
import ScholarsTable from "./components/scholars-table.vue";
import PageHeader from "./components/page-header.vue";

definePageMeta({ layout: "admin" });

type Scholar = {
	lastName: string;
	firstName: string;
	middleInitial: string;
};

const approvedScholars = ref<Scholar[]>([
	{ lastName: "Dela Cruz", firstName: "Juan", middleInitial: "A" },
	{ lastName: "Santos", firstName: "Maria", middleInitial: "B" },
	{ lastName: "Reyes", firstName: "Pedro", middleInitial: "C" },
]);

const numberedScholars = computed(() =>
	approvedScholars.value.map((s, i) => ({ no: i + 1, ...s })),
);

function removeScholar(scholar: any) {
	const index = approvedScholars.value.findIndex(
		(s) =>
			s.lastName === scholar.lastName &&
			s.firstName === scholar.firstName &&
			s.middleInitial === scholar.middleInitial,
	);
	if (index !== -1) approvedScholars.value.splice(index, 1);
}
</script>

<template>
	<div class="p-6 space-y-6">
		<PageHeader
			title="Approved Applicants"
			description="View the list of approved applicants from the ADMIN's perspective."
		/>

		<ScholarsTable
			:scholars="numberedScholars"
			:onRemove="removeScholar"
		/>
	</div>
</template>
