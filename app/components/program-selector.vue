<script setup lang="ts">
import { ref } from "vue";
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[][]>([
	[
		{
			label: "Program",
			type: "label",
		},
		{
			label: "Select Scholarship Program",
			icon: "i-lucide-book-open",
			type: "trigger",
			defaultOpen: true,
			children: [
				{
					label: "TDP",
					description: "Tulong Dunong Program scholars",
					icon: "i-lucide-users",
					to: "/admin/tdp",
				},
				{
					label: "TES",
					description: "Tertiary Education Subsidy scholars",
					icon: "i-lucide-graduation-cap",
					to: "/admin/tes",
				},
			],
		},
	],
]);
</script>

<template>
	<UNavigationMenu
		orientation="vertical"
		:items="items"
		class="w-64"
	/>
</template>
