<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";

definePageMeta({
	layout: "landing",
});

const links = ref<ButtonProps[]>([
	{
		label: "Approved Scholars",
		to: "/approved-scholars",
		icon: "i-lucide-square-play",
	},
	{
		label: "Learn more",
		to: "/about",
		color: "neutral",
		variant: "subtle",
		trailingIcon: "i-lucide-arrow-right",
	},
]);
</script>

<template>
	<UPageHero
		title="CPSU Scholarship"
		description="Track your application status and get a scholarship!"
		headline="Now Approved Applicants"
		orientation="horizontal"
		:links="links"
	>
		<img
			src=""
			alt="Scholarship img"
			class="rounded-lg shadow-2xl ring ring-default"
		/>
	</UPageHero>
</template>
