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
	layout: "user-header",
});
</script>

<template>
	<div class="p-6">
		<!-- USER GUIDE -->
		<section class="max-w-6xl mx-auto px-6">
			<h2 class="text-3xl font-bold mb-6">User Guide</h2>

			<div class="space-y-4 text-gray-700">
				<p><strong>Step 1:</strong> Open the scholarship system homepage.</p>
				<p><strong>Step 2:</strong> Click the <b>Dashboard</b> from the navigation bar.</p>
				<p>
					<strong>Step 3:</strong> The dashboard will display the list of approved scholarship
					applicants.
				</p>
				<p>
					<strong>Step 4:</strong> Review the information of the approved scholars shown in the
					system.
				</p>
				<p>
					<strong>Step 5:</strong> If your name appears on the list, it means you are eligible for
					the scholarship.
				</p>
			</div>
		</section>

		<!-- HELP SECTION -->
		<section class="max-w-6xl mx-auto px-6 pb-16">
			<h2 class="text-3xl font-bold mb-6">Help & Support</h2>

			<div class="grid md:grid-cols-2 gap-6">
				<div class="p-6 bg-gray-50 rounded-xl">
					<h3 class="font-semibold text-lg mb-2">Cannot Find Your Name?</h3>
					<p class="text-gray-600">
						If your name is not listed in the approved applicants, it may still be under review or
						you may not meet the eligibility requirements.
					</p>
				</div>

				<div class="p-6 bg-gray-50 rounded-xl">
					<h3 class="font-semibold text-lg mb-2">System Issues</h3>
					<p class="text-gray-600">
						If you encounter problems while using the system, please contact the scholarship office
						or the system administrator.
					</p>
				</div>

				<div class="p-6 bg-gray-50 rounded-xl">
					<h3 class="font-semibold text-lg mb-2">Need Assistance?</h3>
					<p class="text-gray-600">
						Visit the scholarship office or send a message to the administrator for further
						assistance.
					</p>
				</div>

				<div class="p-6 bg-gray-50 rounded-xl">
					<h3 class="font-semibold text-lg mb-2">Announcement Updates</h3>
					<p class="text-gray-600">
						Check the system regularly for updates regarding scholarship approvals and
						announcements.
					</p>
				</div>
			</div>
		</section>
	</div>
</template>
