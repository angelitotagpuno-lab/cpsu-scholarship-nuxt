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

watch(
	() => form.pwd,
	(val) => {
		if (!val) {
			form.evidenceFile = null;
			evidencePreview.value = null;
		}
	},
);

const dateNow = () =>
	new Date().toLocaleDateString("en-PH", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

const openFile = () => evidenceInput.value?.click();

const handleFile = (event: Event) => {
	const file = (event.target as HTMLInputElement).files?.[0] || null;
	if (!file) return;

	form.evidenceFile = file;
	evidencePreview.value = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
};

const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Space"];
	if (!/[a-zA-Z\s]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
};

const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight"];
	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
};

const submitTesPayout = () => {
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

	toast.add({
		title: "TES Payout Submitted",
		description: "TES payout has been successfully recorded.",
		color: "success",
	});

	form.checkNo = "";
	form.name = "";
	form.pwd = false;
	form.studentId = "";
	form.evidenceFile = null;
	evidencePreview.value = null;
};

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
		description: "All fields are valid. Submit TES payout now?",
		color: "primary",
		actions: [
			{
				label: "Submit",
				color: "primary",
				onClick: () => submitTesPayout(),
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
	<div class="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
		<UCard
			class="w-full max-w-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6"
		>
			<!-- HEADER -->
			<div
				class="rounded-lg bg-indigo-50 p-4 ring-1 ring-indigo-100 dark:bg-indigo-950/30 dark:ring-indigo-900"
			>
				<div class="flex items-start gap-3">
					<div class="rounded-md bg-indigo-600 p-2 text-white">
						<UIcon
							name="i-lucide-wallet"
							class="size-5"
						/>
					</div>

					<div>
						<h1 class="text-base font-semibold text-slate-900 dark:text-white">
							TES Scholarship Payout Portal
						</h1>
						<p class="text-sm text-slate-500 dark:text-slate-400">
							Enter payout details and submit TES stipend records
						</p>
					</div>
				</div>
			</div>

			<!-- FORM -->
			<div class="space-y-4">
				<UInput
					v-model="form.studentId"
					label="Student ID No."
					placeholder="Enter Student ID"
					class="w-full"
					@keydown="allowNumbers"
				/>

				<UInput
					v-model="form.checkNo"
					label="Check Number"
					placeholder="Enter Check Number"
					class="w-full"
					@keydown="allowNumbers"
				/>

				<UInput
					v-model="form.name"
					label="Full Name"
					placeholder="Enter Full Name"
					class="w-full"
					@keydown="allowLetters"
				/>

				<UCheckbox
					v-model="form.pwd"
					label="PWD Beneficiary"
				/>

				<!-- PWD SECTION -->
				<div
					v-if="form.pwd"
					class="space-y-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
				>
					<div class="flex items-center gap-2 font-medium">
						<UIcon
							name="i-lucide-upload"
							class="size-5 text-rose-500"
						/>
						Upload Evidence (Required)
					</div>

					<UButton
						color="primary"
						block
						icon="i-lucide-image"
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
						class="text-sm text-slate-500 break-all"
					>
						{{ form.evidenceFile.name }}
					</p>

					<img
						v-if="evidencePreview"
						:src="evidencePreview"
						class="w-full max-h-40 object-contain rounded-lg border"
					/>
				</div>

				<!-- SUBMIT -->
				<UButton
					color="primary"
					block
					size="lg"
					icon="i-lucide-send"
					class="bg-indigo-600 hover:bg-indigo-700"
					@click="onSubmitClick"
				>
					Submit TES Payout
				</UButton>
			</div>
		</UCard>
	</div>

	<LoginFooter />
</template>
