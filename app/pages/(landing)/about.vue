<script setup lang="ts">
import type { PageFeatureProps } from "@nuxt/ui";

definePageMeta({
	layout: "landing",
});

const features = ref<PageFeatureProps[]>([
	{
		title: "View Approved Scholars",
		description:
			"Users can easily view the list of students who have been approved for the scholarship program based on the system evaluation.",
		icon: "i-lucide-user-check",
		to: "",
	},
	{
		title: "Transparent Scholarship Results",
		description:
			"The system ensures transparency by displaying approved applicants with their academic qualifications and eligibility results.",
		icon: "i-lucide-award",
		to: "",
	},
	{
		title: "Fast and Accessible",
		description:
			"Students can quickly check scholarship results online without needing to visit the office or wait for manual announcements.",
		icon: "i-lucide-monitor",
		to: "",
	},
]);
</script>

<template>
	<UPageSection
		title="Scholarship Eligibility and Approved Applicants"
		description="This system allows students to view the list of approved scholarship applicants. The results are generated using data analytics and eligibility evaluation to ensure fairness and transparency."
		:features="features"
	>
	</UPageSection>
</template>
