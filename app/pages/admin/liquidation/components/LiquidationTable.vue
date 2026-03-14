<script setup lang="ts">
import type { PropType } from "vue";

interface Payout {
	date: string;
	checkNo: string;
	dvPayrollNo: string;
	name: string;
	purpose: string;
	amount: number;
}

const props = defineProps({
	payouts: {
		type: Array as PropType<Payout[]>,
		required: true,
	},
	totalAmount: {
		type: Number,
		required: true,
	},
});

// Format currency
function formatCurrency(amount: number) {
	return amount.toLocaleString("en-PH", { style: "decimal", minimumFractionDigits: 2 });
}
</script>

<template>
	<div class="overflow-x-auto">
		<table class="w-full border-collapse border border-gray-400">
			<thead class="bg-gray-100">
				<tr>
					<th class="border p-2">Check Issued Date</th>
					<th class="border p-2">Check No.</th>
					<th class="border p-2">DV/Payroll No.</th>
					<th class="border p-2">Payee</th>
					<th class="border p-2">Purpose of Payment (TES/ASC)</th>
					<th class="border p-2 text-right">Amount</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="p in payouts"
					:key="p.checkNo"
				>
					<td class="border p-2">{{ p.date }}</td>
					<td class="border p-2">{{ p.checkNo }}</td>
					<td class="border p-2">{{ p.dvPayrollNo }}</td>
					<td class="border p-2">{{ p.name }}</td>
					<td class="border p-2">{{ p.purpose }}</td>
					<td class="border p-2 text-right">{{ formatCurrency(p.amount) }}</td>
				</tr>
				<tr class="font-bold bg-gray-100">
					<td
						class="border p-2 text-right"
						colspan="5"
					>
						TOTAL
					</td>
					<td class="border p-2 text-right">{{ formatCurrency(totalAmount) }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
