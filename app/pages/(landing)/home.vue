<script setup lang="ts">
import { ref } from "vue";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
	layout: "landing",
});

const approvedApplicants = ref([
	{ id: 1, name: "Juan Dela Cruz" },
	{ id: 2, name: "Maria Santos" },
	{ id: 3, name: "Pedro Reyes" },
]);

const columns: TableColumn<{ id: number; name: string }>[] = [
	{ accessorKey: "name", header: "Approved Scholar Names" },
];
</script>

<template>
	<UContainer class="mt-16">
		<h2 class="text-lg font-semibold mb-4">Approved Scholars</h2>
		<UTable
			:data="approvedApplicants"
			:columns="columns"
			sticky
			class="w-full"
		/>
	</UContainer>
</template>
