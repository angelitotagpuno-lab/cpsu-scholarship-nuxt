<script setup lang="ts">
import type { PropType } from "vue";

interface Payout {
	id?: string;
	date: string;
	checkNo: string;
	dvPayrollNo: string;
	name: string;
	pwd: string;
	purpose: string;
	amount: number;
}

defineProps({
	payouts: {
		type: Array as PropType<Payout[]>,
		required: true,
	},
	totalAmount: {
		type: Number,
		required: true,
	},
});

function formatCurrency(amount: number) {
	return amount.toLocaleString("en-PH", {
		style: "decimal",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}
</script>

<template>
	<div
		class="overflow-x-auto rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
	>
		<table class="w-full min-w-[1000px] border-collapse text-sm">
			<thead>
				<tr
					class="bg-slate-100 text-left text-xs font-semibold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300"
				>
					<th class="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
						Check Issued Date
					</th>

					<th class="border-b border-slate-200 px-4 py-3 dark:border-slate-700">Check No.</th>

					<th class="border-b border-slate-200 px-4 py-3 dark:border-slate-700">DV/Payroll No.</th>

					<th class="border-b border-slate-200 px-4 py-3 dark:border-slate-700">Payee</th>

					<th class="border-b border-slate-200 px-4 py-3 text-center dark:border-slate-700">PWD</th>

					<th class="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
						Purpose of Payment
					</th>

					<th class="border-b border-slate-200 px-4 py-3 text-right dark:border-slate-700">
						Amount
					</th>
				</tr>
			</thead>

			<tbody>
				<!-- EMPTY STATE -->
				<tr v-if="payouts.length === 0">
					<td
						colspan="7"
						class="px-4 py-12 text-center"
					>
						<div class="flex flex-col items-center justify-center gap-3">
							<UIcon
								name="i-lucide-file-search"
								class="size-10 text-slate-400"
							/>

							<p class="font-medium text-slate-700 dark:text-slate-200">
								No liquidation records found
							</p>

							<p class="text-sm text-slate-500 dark:text-slate-400">
								No payout records are currently loaded.
							</p>
						</div>
					</td>
				</tr>

				<!-- PAYOUT RECORDS -->
				<tr
					v-for="(p, index) in payouts"
					:key="p.id ?? index"
					class="text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/70"
				>
					<td class="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
						{{ p.date || "—" }}
					</td>

					<td
						class="border-b border-slate-100 px-4 py-3 font-medium text-slate-900 dark:border-slate-800 dark:text-white"
					>
						{{ p.checkNo || "—" }}
					</td>

					<td class="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
						{{ p.dvPayrollNo || "—" }}
					</td>

					<td
						class="border-b border-slate-100 px-4 py-3 font-medium text-slate-900 dark:border-slate-800 dark:text-white"
					>
						{{ p.name || "—" }}
					</td>

					<td class="border-b border-slate-100 px-4 py-3 text-center dark:border-slate-800">
						<span
							v-if="p.pwd"
							class="inline-flex rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200"
						>
							{{ p.pwd }}
						</span>

						<span v-else>—</span>
					</td>

					<td class="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
						{{ p.purpose || "—" }}
					</td>

					<td
						class="border-b border-slate-100 px-4 py-3 text-right font-semibold text-emerald-700 dark:border-slate-800 dark:text-emerald-300"
					>
						{{ formatCurrency(p.amount) }}
					</td>
				</tr>

				<!-- TOTAL -->
				<tr
					class="bg-emerald-50 font-bold text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100"
				>
					<td
						colspan="6"
						class="px-4 py-4 text-right"
					>
						TOTAL
					</td>

					<td class="px-4 py-4 text-right">
						{{ formatCurrency(totalAmount) }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
