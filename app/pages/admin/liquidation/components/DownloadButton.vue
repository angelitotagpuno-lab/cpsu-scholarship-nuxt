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
	filename: {
		type: String,
		required: true,
	},
});

function downloadExcel() {
	let csvContent =
		"Check Issued Date,Check No,DV/Payroll No,Payee,Purpose of Payment (TES/ASC),Amount\n";

	props.payouts.forEach((record) => {
		const row = [
			record.date,
			record.checkNo,
			record.dvPayrollNo,
			`"${record.name}"`,
			`"${record.purpose}"`,
			record.amount.toFixed(2),
		];
		csvContent += row.join(",") + "\n";
	});

	csvContent += `,,,,TOTAL,${props.totalAmount.toFixed(2)}\n`;

	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", props.filename);
	link.click();
	URL.revokeObjectURL(url);
}
</script>

<template>
	<button
		class="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
		@click="downloadExcel"
	>
		Download Excel
	</button>
</template>
