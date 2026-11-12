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
		pwd: "No",
		purpose:
			"Stipend allowance of TDP - TES CPSU San Carlos Campus for the Academic Year 2023-2024, 1st Semester.",
		amount: 7500,
	},
	{
		date: "2024-07-08",
		checkNo: "0001676057",
		dvPayrollNo: "2024-07-0245",
		name: "Danica Abella",
		pwd: "Yes",
		purpose:
			"Stipend allowance of TDP - TES CPSU San Carlos Campus for the Academic Year 2023-2024, 1st Semester.",
		amount: 9500,
	},
]);

const totalTdpAmount = computed(() => tdpPayouts.value.reduce((sum, r) => sum + r.amount, 0));
</script>

<template>
	<div class="h-full space-y-6 overflow-y-auto bg-slate-50 p-6 dark:bg-slate-950">
		<!-- PAGE HEADER -->
		<div
			class="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
		>
			<div class="flex items-center gap-3">
				<UDashboardSidebarCollapse />

				<div>
					<h1 class="text-xl font-bold text-slate-900 dark:text-white">TDP Liquidation Records</h1>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						View and export TDP payout records
					</p>
				</div>
			</div>
		</div>

		<!-- CONTENT CARD -->
		<div
			class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 space-y-4"
		>
			<div class="flex items-center justify-between">
				<h2 class="font-semibold text-slate-900 dark:text-white">TDP Payout List</h2>

				<DownloadButton
					:payouts="tdpPayouts"
					:totalAmount="totalTdpAmount"
					filename="TDP_Liquidation.csv"
				/>
			</div>

			<div class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
				<LiquidationTable
					:payouts="tdpPayouts"
					:totalAmount="totalTdpAmount"
				/>
			</div>
		</div>
	</div>
</template>
