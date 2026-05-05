<script setup lang="ts">
defineProps<{
	title: string;
	description?: string;
}>();
</script>

<template>
	<div class="min-w-0">
		<h1 class="truncate text-2xl font-bold text-slate-900 dark:text-white">
			{{ title }}
		</h1>

		<p
			v-if="description"
			class="mt-1 text-sm text-slate-500 dark:text-slate-400"
		>
			{{ description }}
		</p>
	</div>
</template>
