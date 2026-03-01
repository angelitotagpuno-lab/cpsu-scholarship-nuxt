<script setup lang="ts">
defineProps<{
	title: string;
	description?: string;
}>();
</script>

<template>
	<div>
		<div class="flex items-center gap-3">
			<UDashboardSidebarCollapse />
			<h1 class="text-2xl font-bold">{{ title }}</h1>
		</div>
		<p
			v-if="description"
			class="text-gray-500 dark:text-gray-400"
		>
			{{ description }}
		</p>
	</div>
</template>
