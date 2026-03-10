<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
	layout: "admin",
});

// Sample TDP payouts
const tdpPayouts = ref([
	{
		date: "2026-03-10",
		checkNo: "0001676056",
		name: "Raven Ann Abadies",
		pwd: "No",
		purpose:
			"Stipend allowance of TDP - TES CPSU San Carlos Campus for the Academic Year 2023-2024, 1st Semester.",
		amount: "7,500.00",
	},
]);

// Sample TES payouts
const tesPayouts = ref([
	{
		date: "2026-03-10",
		checkNo: "0001679001",
		name: "Juan Dela Cruz",
		purpose:
			"Stipend allowance of TES - CPSU San Carlos Campus for the Academic Year 2023-2024, 1st Semester.",
		amount: "10,000.00",
	},
]);
</script>

<template>
	<div class="p-6 space-y-8">
		<h1 class="text-2xl font-bold mb-4">Scholarship Liquidation Records</h1>

		<!-- TDP Table -->
		<div class="overflow-x-auto">
			<h2 class="text-lg font-semibold mb-2">TDP Records</h2>
			<table class="w-full border">
				<thead class="bg-gray-100 dark:bg-gray-700">
					<tr>
						<th class="border p-2">Date</th>
						<th class="border p-2">Check No</th>
						<th class="border p-2">Name</th>
						<th class="border p-2">PWD</th>
						<th class="border p-2">Purpose</th>
						<th class="border p-2 text-right">Amount</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="p in tdpPayouts"
						:key="p.checkNo"
					>
						<td class="border p-2">{{ p.date }}</td>
						<td class="border p-2">{{ p.checkNo }}</td>
						<td class="border p-2">{{ p.name }}</td>
						<td class="border p-2">{{ p.pwd }}</td>
						<td class="border p-2">{{ p.purpose }}</td>
						<td class="border p-2 text-right">{{ p.amount }}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Separator -->
		<div class="border-t border-gray-300 dark:border-gray-600 my-6"></div>

		<!-- TES Table -->
		<div class="overflow-x-auto">
			<h2 class="text-lg font-semibold mb-2">TES Records</h2>
			<table class="w-full border">
				<thead class="bg-gray-100 dark:bg-gray-700">
					<tr>
						<th class="border p-2">Date</th>
						<th class="border p-2">Check No</th>
						<th class="border p-2">Name</th>
						<th class="border p-2">Purpose</th>
						<th class="border p-2 text-right">Amount</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="p in tesPayouts"
						:key="p.checkNo"
					>
						<td class="border p-2">{{ p.date }}</td>
						<td class="border p-2">{{ p.checkNo }}</td>
						<td class="border p-2">{{ p.name }}</td>
						<td class="border p-2">{{ p.purpose }}</td>
						<td class="border p-2 text-right">{{ p.amount }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
