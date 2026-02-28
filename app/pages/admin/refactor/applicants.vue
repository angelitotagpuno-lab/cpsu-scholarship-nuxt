<script setup lang="ts">
import { ref, computed, h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
	layout: "admin",
});

type Scholar = {
	lastName: string;
	firstName: string;
	middleInitial: string;
};

const approvedScholars = ref<Scholar[]>([
	{ lastName: "Dela Cruz", firstName: "Juan", middleInitial: "A" },
	{ lastName: "Santos", firstName: "Maria", middleInitial: "B" },
	{ lastName: "Reyes", firstName: "Pedro", middleInitial: "C" },
	{ lastName: "Lopez", firstName: "Ana", middleInitial: "D" },
	{ lastName: "Rivera", firstName: "Mark", middleInitial: "E" },
	{ lastName: "Ramos", firstName: "Liza", middleInitial: "F" },
]);

// Add numbering automatically
const numberedScholars = computed(() =>
	approvedScholars.value.map((s, index) => ({
		no: index + 1,
		...s,
	})),
);

// Columns including remove button
const columns: TableColumn<(typeof numberedScholars.value)[0]>[] = [
	{ accessorKey: "no", header: "No.", size: 60 },
	{ accessorKey: "lastName", header: "Last Name" },
	{ accessorKey: "firstName", header: "First Name" },
	{ accessorKey: "middleInitial", header: "M.I.", size: 60 },
	{
		id: "actions",
		header: "Actions",
		size: 120, // fixed width for alignment
		cell: ({ row }) => {
			const scholar = row.original;
			return h(
				"div",
				{ class: "flex justify-center" }, // center the button
				h(resolveComponent("UButton"), {
					label: "Remove",
					size: "xs",
					color: "error",
					variant: "outline",
					onClick: () => {
						const index = approvedScholars.value.findIndex(
							(s) =>
								s.lastName === scholar.lastName &&
								s.firstName === scholar.firstName &&
								s.middleInitial === scholar.middleInitial,
						);
						if (index !== -1) approvedScholars.value.splice(index, 1);
					},
				}),
			);
		},
	},
];
</script>

<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold mb-4">Approved Applicants</h1>
		<p>View the list of approved applicants from the ADMIN's perspective.</p>

		<!-- Table -->
		<div class="mt-6 border rounded-lg overflow-x-auto">
			<UTable
				:data="numberedScholars"
				:columns="columns"
				class="min-w-[600px]"
			/>
		</div>
	</div>
</template>
