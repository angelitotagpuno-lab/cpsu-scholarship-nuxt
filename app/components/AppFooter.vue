<script setup lang="ts">
// Footer sections with label + description
const sections: Array<{
	label: string;
	items: Array<{ label: string; description?: string; to?: string; target?: string }>;
}> = [
	{
		label: "About",
		items: [
			{
				label: "San Carlos CPSU Scholarship",
				description:
					"The CPSU Scholarship program provides financial support to deserving students and allows them to track their application status online for transparency and convenience.",
			},
		],
	},
	{
		label: "Contact",
		items: [
			{ label: "Address", description: "San Carlos City, Negros Occidental, Philippines" },
			{ label: "Email", description: "scholarship@cpsu.edu.ph" },
			{ label: "Phone", description: "+63 34 123 4567" },
		],
	},
	{
		label: "Help",
		items: [
			{ label: "FAQs", description: "Frequently asked questions about the scholarship program." },
			{ label: "Support", description: "Reach out to the scholarship office for assistance." },
		],
	},
];
</script>

<template>
	<UFooter class="bg-background text-gray-800 dark:text-gray-200">
		<div class="p-10 max-w-7xl mx-auto">
			<!-- Footer columns -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div
					v-for="(section, idx) in sections"
					:key="idx"
					class="space-y-3"
				>
					<h4 class="font-bold text-lg">{{ section.label }}</h4>
					<div
						v-for="(item, idy) in section.items"
						:key="idy"
						class="space-y-1"
					>
						<p
							v-if="item.label"
							class="font-medium"
						>
							{{ item.label }}
						</p>
						<p
							v-if="item.description"
							class="text-sm text-muted"
						>
							{{ item.description }}
						</p>
					</div>
				</div>
			</div>

			<!-- Horizontal line: full width -->
			<div class="mt-8 border-t border-gray-400 dark:border-gray-600"></div>

			<!-- Full-width copyright at bottom -->
			<div class="mt-4 text-center text-sm text-muted">
				© {{ new Date().getFullYear() }} San Carlos CPSU Scholarship. All rights reserved. Designed
				by CPSU IT Department.
			</div>
		</div>
	</UFooter>
</template>
