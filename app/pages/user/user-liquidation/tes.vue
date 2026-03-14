<script setup lang="ts">
import { reactive } from "vue";

definePageMeta({ layout: "user-header" });

const form = reactive({
	checkNo: "",
	name: "",
	pwd: false,
});

const dateNow = () =>
	new Date().toLocaleDateString("en-PH", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

const addPayout = () => {
	if (!form.checkNo || !form.name) return alert("Please fill all fields.");

	const amount = 7500 + (form.pwd ? 2000 : 0);
	const payoutData = {
		date: dateNow(),
		checkNo: form.checkNo,
		name: form.name,
		purpose:
			"Stipend allowance of TDP - TES CPSU San Carlos Campus for the Academic Year 2023-2024, 1st Semester.",
		amount: amount.toFixed(2),
		pwd: form.pwd ? "Yes" : "No",
	};

	console.log("Submitted TDP payout:", payoutData);
	alert("TDP Payout submitted successfully!");

	form.checkNo = "";
	form.name = "";
	form.pwd = false;
};
</script>

<template>
	<div class="p-4 sm:p-6 max-w-xl mx-auto min-h-screen flex flex-col">
		<h1 class="text-2xl font-bold mb-6 text-center text-foreground dark:text-white">
			TES Scholarship Payout Portal
		</h1>

		<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
			<div>
				<label class="block mb-1 font-medium text-foreground dark:text-gray-200"
					>Check Number</label
				>
				<input
					v-model="form.checkNo"
					class="w-full border rounded p-2 bg-white dark:bg-gray-700 text-foreground dark:text-gray-200"
					placeholder="Enter Check Number"
				/>
			</div>

			<div>
				<label class="block mb-1 font-medium text-foreground dark:text-gray-200">Full Name</label>
				<input
					v-model="form.name"
					class="w-full border rounded p-2 bg-white dark:bg-gray-700 text-foreground dark:text-gray-200"
					placeholder="Enter your name"
				/>
			</div>

			<button
				@click="addPayout"
				class="w-full bg-green-600 dark:bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
			>
				Submit TES Payout
			</button>
		</div>
	</div>

	<LoginFooter />
</template>
