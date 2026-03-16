<script setup lang="ts">
import { ref } from "vue";
import type { ButtonProps, PageFeatureProps } from "@nuxt/ui";

// Page layout
definePageMeta({
	layout: "login",
});

// Hero links
const links = ref<ButtonProps[]>([
	{ label: "Apply Now", to: "/user-login", icon: "i-lucide-square-play" },
	{
		label: "Learn more",
		to: "/",
		color: "neutral",
		variant: "subtle",
		trailingIcon: "i-lucide-arrow-right",
	},
]);

// Features section
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

// Guidelines cards
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

// Step-by-step instructions
const steps = ref([
	{
		title: "Step 1: Login",
		description: "Access the portal using your student credentials.",
		icon: "i-lucide-log-in",
	},
	{
		title: "Step 2: Navigate to Applications",
		description: "Click on the 'Approved Scholars' section to view your application status.",
		icon: "i-lucide-folder",
	},
	{
		title: "Step 3: Check Results",
		description:
			"Wait for the system to process applications. Results are usually released within 3-5 business days.",
		icon: "i-lucide-hourglass",
	},
	{
		title: "Step 4: Follow Up",
		description:
			"If approved, follow instructions for scholarship enrollment. If not, review the eligibility criteria for the next cycle.",
		icon: "i-lucide-check-circle",
	},
]);
</script>

<template>
	<!-- Hero Section -->
	<UPageHero
		title="CPSU Scholarship"
		description="Track your application status and get a scholarship!"
		headline="Now Approved Applicants"
		orientation="horizontal"
		:links="links"
	>
		<img
			src="/logo.png"
			alt="Scholarship img"
			class="rounded-lg shadow-2xl ring ring-default"
		/>
	</UPageHero>

	<!-- Features Section -->
	<UPageSection
		title="Scholarship Eligibility and Approved Applicants"
		description="This system allows students to view the list of approved scholarship applicants. The results are generated using data analytics and eligibility evaluation to ensure fairness and transparency."
		:features="features"
	>
	</UPageSection>

	<!-- Guidelines Section -->
	<UPageSection
		title="Scholarship Guidelines"
		description="Make sure to review these guidelines before applying."
	>
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
	</UPageSection>

	<!-- Step-by-Step Instructions Section -->
	<UPageSection
		title="How to Access the Portal & Check Results"
		description="Follow these steps after logging in to the portal. Results are typically released within 3-5 business days."
	>
		<UPageGrid>
			<UPageCard
				v-for="(step, index) in steps"
				:key="index"
				:title="step.title"
				:description="step.description"
				:icon="step.icon"
				class="p-4 whitespace-pre-line"
			/>
		</UPageGrid>
	</UPageSection>
	<AppFooter />
</template>
