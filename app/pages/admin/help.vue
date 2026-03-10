<script setup lang="ts">
import type { PageFeatureProps } from "@nuxt/ui";

definePageMeta({
	layout: "admin",
});

const features = ref<PageFeatureProps[]>([
	{
		title: "View Approved Scholars",
		description:
			"Students can see the official list of approved scholarship applicants in the system.",
		icon: "i-lucide-user-check",
		to: "",
	},
	{
		title: "Check Scholarship Results",
		description:
			"The system displays the results of the scholarship evaluation after the administrator completes the review.",
		icon: "i-lucide-award",
		to: "",
	},
	{
		title: "Simple and Accessible",
		description:
			"The scholarship results can be viewed anytime and anywhere using the online system.",
		icon: "i-lucide-monitor",
		to: "",
	},
]);

const steps = [
	{
		title: "Open the Scholarship System",
		description: "Access the scholarship eligibility system using your browser.",
		icon: "i-lucide-globe",
	},
	{
		title: "Go to the Dashboard",
		description: "Navigate to the dashboard to view the list of approved scholarship applicants.",
		icon: "i-lucide-layout-dashboard",
	},
	{
		title: "View Approved Applicants",
		description: "The system will display students who passed the eligibility evaluation.",
		icon: "i-lucide-users",
	},
	{
		title: "Check Details",
		description:
			"You can review the applicant's information such as GPA, scholarship type, and eligibility result.",
		icon: "i-lucide-file-text",
	},
];
</script>

<template>
	<div class="space-y-10">
		<!-- ABOUT THE SYSTEM -->
		<UPageSection
			title="About the Scholarship Eligibility System"
			description="This system was developed to help students easily check the list of approved scholarship applicants. The platform uses evaluation criteria such as academic performance and eligibility requirements to determine qualified scholars."
			:features="features"
		/>

		<!-- SYSTEM FLOW -->
		<section class="max-w-6xl mx-auto px-6">
			<h2 class="text-3xl font-bold mb-6">System Flow</h2>
			<p class="text-gray-600 mb-8">
				The scholarship eligibility system follows a simple process where applications are evaluated
				by the administrator and only approved applicants are displayed for users to view.
			</p>

			<div class="grid md:grid-cols-4 gap-6">
				<div
					v-for="(step, index) in steps"
					:key="index"
					class="p-6 bg-white dark:bg-gray-900 rounded-xl shadow"
				>
					<UIcon
						:name="step.icon"
						class="text-3xl mb-3 text-primary"
					/>
					<h3 class="font-semibold text-lg mb-2">
						{{ step.title }}
					</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						{{ step.description }}
					</p>
				</div>
			</div>
		</section>
	</div>
</template>
