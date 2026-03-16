<script setup lang="ts">
import { ref, computed } from "vue";
import LiquidationTable from "./components/LiquidationTable.vue";
import DownloadButton from "./components/DownloadButton.vue";

definePageMeta({
	layout: "admin",
});

// ----- TDP payouts -----
const tdpPayouts = ref([
	{
		date: "2024-07-08",
		checkNo: "0001676056",
		dvPayrollNo: "2024-07-0245",
		name: "Raven Ann Abadies",
		purpose:
			"Stipend allowance of TDP - TES CPSU San Carlos Campus for the Academic Year 2023-2024, 1st Semester.",
		amount: 7500,
	},
	{
		date: "2024-07-08",
		checkNo: "0001676057",
		dvPayrollNo: "2024-07-0245",
		name: "Danica Abella",
		purpose:
			"Stipend allowance of TDP - TES CPSU San Carlos Campus for the Academic Year 2023-2024, 1st Semester.",
		amount: 7500,
	},
]);

const totalTdpAmount = computed(() => tdpPayouts.value.reduce((sum, r) => sum + r.amount, 0));
</script>

<template>
	<div class="p-6 space-y-12">
		<!-- TDP Section -->
		<section>
			<h1 class="text-2xl font-bold mb-4">TDP Liquidation Records</h1>
			<DownloadButton
				:payouts="tdpPayouts"
				:totalAmount="totalTdpAmount"
				filename="TDP_Liquidation.csv"
			/>
			<LiquidationTable
				:payouts="tdpPayouts"
				:totalAmount="totalTdpAmount"
			/>
		</section>
	</div>
</template>
