<script setup lang="ts">
import { reactive, ref, watch } from "vue";

definePageMeta({ layout: "user-header" });

const toast = useToast();

const form = reactive({
	checkNo: "",
	name: "",
	pwd: false,
	awardNo: "",
	studentId: "",
	evidenceFile: null as File | null,
});

const evidencePreview = ref<string | null>(null);
const evidenceInput = ref<HTMLInputElement | null>(null);

/* =========================
   RESET FILE WHEN PWD OFF
========================= */
watch(
	() => form.pwd,
	(val) => {
		if (!val) {
			form.evidenceFile = null;
			evidencePreview.value = null;
		}
	},
);

/* =========================
   DATE
========================= */
const dateNow = () =>
	new Date().toLocaleDateString("en-PH", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

/* =========================
   FILE HANDLING
========================= */
const openFile = () => {
	evidenceInput.value?.click();
};

const handleFile = (event: Event) => {
	const file = (event.target as HTMLInputElement).files?.[0] || null;
	if (!file) return;

	form.evidenceFile = file;
	evidencePreview.value = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
};

/* =========================
   VALIDATION
========================= */
const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Space"];
	if (!/[a-zA-Z\s]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};

const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight"];
	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};

/* =========================
   FINAL SUBMIT
========================= */
const submitPayout = () => {
	const amount = 7500 + (form.pwd ? 2000 : 0);

	const payoutData = {
		date: dateNow(),
		checkNo: form.checkNo,
		name: form.name,
		awardNo: form.awardNo,
		studentId: form.studentId,
		pwd: form.pwd ? "Yes" : "No",
		evidenceFile: form.evidenceFile?.name || null,
		amount: amount.toFixed(2),
	};

	console.log("Submitted TDP payout:", payoutData);

	toast.add({
		title: "Payout Submitted",
		description: "TDP payout has been successfully recorded.",
		color: "success",
	});

	// reset
	form.checkNo = "";
	form.name = "";
	form.pwd = false;
	form.studentId = "";
	form.evidenceFile = null;
	evidencePreview.value = null;
};

/* =========================
   SUBMIT CLICK (TDP STYLE)
========================= */
const onSubmitClick = () => {
	if (!form.studentId || !form.checkNo || !form.name) {
		toast.add({
			title: "Incomplete Form",
			description: "Please fill all required fields.",
			color: "error",
		});
		return;
	}

	if (form.pwd && !form.evidenceFile) {
		toast.add({
			title: "Missing Requirement",
			description: "PWD users must upload evidence image.",
			color: "error",
		});
		return;
	}

	toast.add({
		title: "Confirm Submission",
		description: "All fields are valid. Submit payout now?",
		color: "primary",
		actions: [
			{
				label: "Submit",
				color: "primary",
				onClick: () => submitPayout(),
			},
			{
				label: "Cancel",
				color: "neutral",
			},
		],
	});
};
</script>

<template>
	<div class="min-h-screen flex items-center justify-center p-4">
		<UCard class="w-full max-w-xl">
			<h1 class="text-xl font-bold text-center mb-6">TDP Scholarship Payout Portal</h1>

			<div class="flex flex-col gap-5 w-full">
				<!-- Student ID -->
				<UInput
					v-model="form.studentId"
					label="Student ID No."
					placeholder="Enter Student ID"
					class="w-full"
					@keydown="allowNumbers"
				/>

				<!-- Check Number -->
				<UInput
					v-model="form.checkNo"
					label="Check Number"
					placeholder="Enter Check Number"
					class="w-full"
					@keydown="allowNumbers"
				/>

				<!-- Full Name -->
				<UInput
					v-model="form.name"
					label="Full Name"
					placeholder="Enter Full Name"
					class="w-full"
					@keydown="allowLetters"
				/>

				<!-- PWD -->
				<UCheckbox
					v-model="form.pwd"
					label="PWD"
				/>

				<!-- Upload -->
				<div
					v-if="form.pwd"
					class="flex flex-col gap-3 w-full"
				>
					<p class="text-sm font-medium">Upload Evidence (Required for PWD)</p>

					<UButton
						color="primary"
						block
						@click="openFile"
					>
						Upload Image
					</UButton>

					<input
						ref="evidenceInput"
						type="file"
						class="hidden"
						accept="image/*"
						@change="handleFile"
					/>

					<p
						v-if="form.evidenceFile"
						class="text-sm text-gray-500 break-all"
					>
						{{ form.evidenceFile.name }}
					</p>

					<img
						v-if="evidencePreview"
						:src="evidencePreview"
						class="w-full max-h-40 object-contain rounded-lg border"
					/>
				</div>

				<UButton
					color="success"
					block
					@click="onSubmitClick"
				>
					Submit TDP Payout
				</UButton>
			</div>
		</UCard>
	</div>

	<LoginFooter />
</template>
