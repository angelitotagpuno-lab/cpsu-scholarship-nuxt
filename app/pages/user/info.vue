<script setup lang="ts">
import type { PageFeatureProps } from "@nuxt/ui";

definePageMeta({
	layout: "user-header",
});

const features = ref<PageFeatureProps[]>([
	{
		title: "Icons",
		description: "Nuxt UI integrates with Nuxt Icon to access over 200,000+ icons from Iconify.",
		icon: "i-lucide-smile",
		to: "",
	},
	{
		title: "Fonts",
		description: "Nuxt UI integrates with Nuxt Fonts to provide plug-and-play font optimization.",
		icon: "i-lucide-a-large-small",
		to: "",
	},
	{
		title: "Color Mode",
		description: "Nuxt UI integrates with Nuxt Color Mode to switch between light and dark.",
		icon: "i-lucide-sun-moon",
		to: "",
	},
]);
</script>

<template>
	<UPageSection
		title="Beautiful Vue UI components"
		description="Nuxt UI provides a comprehensive suite of components and utilities to help you build beautiful and accessible web applications with Vue and Nuxt."
		:features="features"
	/>
</template>
