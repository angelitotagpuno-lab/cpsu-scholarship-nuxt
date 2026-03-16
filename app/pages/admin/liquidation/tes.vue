<script setup lang="ts">
import { ref, computed } from "vue";
import LiquidationTable from "./components/LiquidationTable.vue";
import DownloadButton from "./components/DownloadButton.vue";

definePageMeta({
	layout: "admin",
});

const tesPayouts = ref([
	{
		date: "2024-07-10",
		checkNo: "0001676100",
		dvPayrollNo: "2024-07-0250",
		name: "Mark Anthony Santos",
		purpose: `Stipend allowance of TES - TES CPSU San Carlos Campus for the Academic Year 2023-2024, 1st Semester.`,
		amount: 10000,
	},
	{
		date: "2024-07-10",
		checkNo: "0001676101",
		dvPayrollNo: "2024-07-0250",
		name: "Angela Reyes",
		purpose: `Stipend allowance of TES - TES CPSU San Carlos Campus for the Academic Year 2023-2024, 1st Semester.`,
		amount: 10000,
	},
]);

const totalTesAmount = computed(() => tesPayouts.value.reduce((sum, r) => sum + r.amount, 0));
</script>

<template>
	<div>
		<!-- TES Section -->
		<section>
			<h1 class="text-2xl font-bold mb-4">TES Liquidation Records</h1>
			<DownloadButton
				:payouts="tesPayouts"
				:totalAmount="totalTesAmount"
				filename="TES_Liquidation.csv"
			/>
			<LiquidationTable
				:payouts="tesPayouts"
				:totalAmount="totalTesAmount"
			/>
		</section>
	</div>
</template>
