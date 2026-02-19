<script setup lang="ts">
import { ref, computed } from "vue";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
	layout: "user-header",
});

const scholars = ref([
	{ lastName: "Dela Cruz", firstName: "Juan", middleInitial: "A" },
	{ lastName: "Santos", firstName: "Maria", middleInitial: "B" },
	{ lastName: "Reyes", firstName: "Pedro", middleInitial: "C" },
	{ lastName: "Lopez", firstName: "Ana", middleInitial: "D" },
	{ lastName: "Rivera", firstName: "Mark", middleInitial: "E" },
	{ lastName: "Ramos", firstName: "Liza", middleInitial: "F" },
]);

// Add numbering automatically
const numberedScholars = computed(() =>
	scholars.value.map((s, index) => ({
		no: index + 1,
		...s,
	})),
);

const columns: TableColumn<(typeof numberedScholars.value)[0]>[] = [
	{ accessorKey: "no", header: "No." },
	{ accessorKey: "lastName", header: "Last Name" },
	{ accessorKey: "firstName", header: "First Name" },
	{ accessorKey: "middleInitial", header: "M.I." },
];
</script>

<template>
	<div class="flex justify-center">
		<div class="w-full max-w-3xl">
			<h2 class="text-xl font-semibold mb-4 text-center">Approved Scholars</h2>

			<UTable
				:data="numberedScholars"
				:columns="columns"
				class="w-full"
			/>
		</div>
	</div>
</template>
