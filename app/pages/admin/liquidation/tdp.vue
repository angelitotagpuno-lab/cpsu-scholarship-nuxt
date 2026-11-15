<script setup lang="ts">
import { ref, computed } from "vue";

import ClaimablePayout from "./components/claimable-payout.vue";
import LiquidationTable from "./components/LiquidationTable.vue";
import DownloadButton from "./components/DownloadButton.vue";

import type { Payout, LiquidationRecord } from "~/types/payout";

definePageMeta({
	layout: "admin",
});

// Liquidation records
// Waiting for an admin payout-list API endpoint
const tdpPayouts = ref<LiquidationRecord[]>([]);

// Raw payout records for the claimable UI
// No admin payout-list endpoint is documented yet
const adminPayouts = ref<Payout[]>([]);

// Total TDP liquidation amount
const totalTdpAmount = computed(() =>
	tdpPayouts.value.reduce((sum, record) => sum + record.amount, 0),
);

// Refresh admin payouts
// To be implemented when an admin payout-list API is available
async function refreshAdminPayouts() {
	// No documented admin payout-list endpoint yet.
	// Keep the current records unchanged.
}
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
						Manage claimable payouts and view TDP liquidation records.
					</p>
				</div>
			</div>
		</div>

		<!-- CLAIMABLE PAYOUT SECTION -->
		<div
			class="space-y-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
		>
			<ClaimablePayout
				:payouts="adminPayouts"
				@updated="refreshAdminPayouts"
			/>
		</div>

		<!-- LIQUIDATION RECORDS -->
		<div
			class="space-y-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
		>
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 class="font-semibold text-slate-900 dark:text-white">TDP Payout List</h2>

					<p class="text-sm text-slate-500 dark:text-slate-400">
						View and export TDP liquidation records.
					</p>
				</div>

				<DownloadButton
					v-if="tdpPayouts.length > 0"
					:payouts="tdpPayouts"
					:totalAmount="totalTdpAmount"
					filename="TDP_Liquidation.csv"
				/>
			</div>

			<LiquidationTable
				:payouts="tdpPayouts"
				:totalAmount="totalTdpAmount"
			/>
		</div>
	</div>
</template>
