<script setup lang="ts">
import { ref } from "vue";

const helpCards = ref([
	{
		title: "Using the Dashboard",
		description:
			"The dashboard shows your profile overview, including your GPA, year level, and other details. You can also view the list of approved scholars from this page.",
		icon: "i-lucide-layout-dashboard",
	},
	{
		title: "Common Issues",
		description:
			"If approved scholars are not visible, refresh your page. If your profile information is incorrect, inform the admin. For slow loading, check your internet connection.",
		icon: "i-lucide-alert-circle",
	},
	{
		title: "FAQs",
		description:
			"Q: Can I apply again next year?\nA: Yes, if you meet the eligibility criteria.\n\nQ: Can I view other students’ applications?\nA: No, only approved scholars are visible.\n\nQ: How do I know if I’m eligible?\nA: Eligibility is based on GPA, family income, year level, and special status. Check the Scholarship Guidelines page for full details.",
		icon: "i-lucide-help-circle",
	},
]);

definePageMeta({
	layout: "landing",
});
</script>

<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold text-center mb-6">Help & FAQs</h1>

		<UPageGrid>
			<UPageCard
				v-for="(card, index) in helpCards"
				:key="index"
				:title="card.title"
				:description="card.description"
				:icon="card.icon"
				class="p-4 whitespace-pre-line"
			/>
		</UPageGrid>
	</div>
</template>
