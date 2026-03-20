<script setup lang="ts">
import { reactive, ref } from "vue";

definePageMeta({ layout: "user-header" });

const form = reactive({
	checkNo: "",
	name: "",
	pwd: false,
	awardNo: "",
	studentId: "",
	evidenceFile: null as File | null,
});

const evidencePreview = ref<string | null>(null);

// Generate Auto IDs (similar pattern to TDP)
const generateIDs = () => {
	const date = new Date();
	const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
	const randomNum = Math.floor(Math.random() * 1000000000)
		.toString()
		.padStart(9, "0");
	form.awardNo = `TES-${dateStr}-${randomNum}`;
	form.studentId = `${Math.floor(Math.random() * 100000)
		.toString()
		.padStart(5, "0")}-${dateStr}-TS`;
};

// Call once on load
generateIDs();

const dateNow = () =>
	new Date().toLocaleDateString("en-PH", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

const handleFile = (event: Event) => {
	const file = (event.target as HTMLInputElement).files?.[0] || null;
	if (!file) return;

	form.evidenceFile = file;
	evidencePreview.value = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
};

const addPayout = () => {
	if (!form.checkNo || !form.name) return alert("Please fill all fields.");

	const amount = 7500 + (form.pwd ? 2000 : 0);
	const payoutData = {
		date: dateNow(),
		checkNo: form.checkNo,
		name: form.name,
		awardNo: form.awardNo,
		studentId: form.studentId,
		pwd: form.pwd ? "Yes" : "No",
		evidenceFile: form.evidenceFile?.name || null,
		purpose:
			"Stipend allowance of TES CPSU San Carlos Campus for the Academic Year 2023-2024, 1st Semester.",
		amount: amount.toFixed(2),
	};

	console.log("Submitted TES payout:", payoutData);
	alert("TES Payout submitted successfully!");

	// Reset
	form.checkNo = "";
	form.name = "";
	form.pwd = false;
	form.evidenceFile = null;
	evidencePreview.value = null;
	generateIDs(); // regenerate IDs
};
</script>

<template>
	<div class="p-4 sm:p-6 max-w-xl mx-auto min-h-screen flex flex-col">
		<h1 class="text-2xl font-bold mb-6 text-center text-foreground dark:text-white">
			TES Scholarship Payout Portal
		</h1>

		<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
			<!-- Auto IDs -->
			<div>
				<label class="block mb-1 font-medium text-foreground dark:text-gray-200">
					Award No.*
				</label>
				<input
					v-model="form.awardNo"
					class="w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-foreground dark:text-gray-200"
					readonly
				/>
			</div>

			<div>
				<label class="block mb-1 font-medium text-foreground dark:text-gray-200">
					Student ID No.
				</label>
				<input
					v-model="form.studentId"
					class="w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-foreground dark:text-gray-200"
					readonly
				/>
			</div>

			<div>
				<label class="block mb-1 font-medium text-foreground dark:text-gray-200">
					Check Number
				</label>
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

			<div class="flex items-center gap-2">
				<input
					id="pwd"
					v-model="form.pwd"
					type="checkbox"
				/>
				<label
					for="pwd"
					class="text-foreground dark:text-gray-200"
					>PWD</label
				>
			</div>

			<!-- Evidence Upload Button -->
			<div>
				<label class="block mb-2 font-medium text-foreground dark:text-gray-200">
					Upload Evidence (Optional)
				</label>
				<div class="flex flex-col gap-2">
					<button
						type="button"
						class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md w-full sm:w-auto max-w-xs"
						@click="$refs.evidenceInput.click()"
					>
						Upload Image
					</button>
					<input
						type="file"
						ref="evidenceInput"
						class="hidden"
						@change="handleFile"
						accept="image/*"
					/>
					<div
						v-if="form.evidenceFile"
						class="text-sm text-gray-700 dark:text-gray-300"
					>
						{{ form.evidenceFile.name }}
					</div>
					<img
						v-if="evidencePreview"
						:src="evidencePreview"
						class="max-h-40 mt-2 rounded"
					/>
				</div>
			</div>

			<button
				class="w-full bg-green-600 dark:bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
				@click="addPayout"
			>
				Submit TES Payout
			</button>
		</div>
	</div>

	<LoginFooter />
</template>
