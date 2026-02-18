<script setup lang="ts">
import { ref } from "vue";

const guidelineCards = ref([
	{
		title: "Eligibility Criteria",
		description: `• Minimum GPA: 2.5 or higher
• Maximum family monthly income: PHP 25,000
• Year level: 2nd year and above
• Special status: Indigent, Awardee, or as defined by the scholarship`,
		icon: "i-lucide-award",
	},
	{
		title: "Required Documents",
		description: `• Filled application form
• Latest transcript of records
• Proof of family income
• Copy of valid ID
• Other supporting documents as needed`,
		icon: "i-lucide-file-text",
	},
	{
		title: "Application Process",
		description: `• Applications open: April 1, 2026
• Applications close: May 15, 2026
• After submission, applications are reviewed by the scholarship committee
• Only approved scholars are displayed in the system`,
		icon: "i-lucide-clipboard-list",
	},
	{
		title: "Additional Notes",
		description: `• Ensure all documents are complete and correct
• Incomplete applications may be disqualified
• Follow deadlines strictly to avoid disqualification`,
		icon: "i-lucide-info",
	},
]);

definePageMeta({
	layout: "landing",
});
</script>

<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold text-center mb-6">Scholarship Guidelines</h1>

		<UPageGrid>
			<UPageCard
				v-for="(card, index) in guidelineCards"
				:key="index"
				:title="card.title"
				:description="card.description"
				:icon="card.icon"
				class="p-4 whitespace-pre-line"
			/>
		</UPageGrid>
	</div>
</template>
