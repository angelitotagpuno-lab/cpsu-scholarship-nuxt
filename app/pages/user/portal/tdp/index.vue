<script setup lang="ts">
import StudentInformation from "./components/StudentInformation.vue";
import AddressInformation from "./components/AddressInformation.vue";
import SchoolInformation from "./components/SchoolInformation.vue";
import FamilyInformation from "./components/FamilyInformation.vue";
import { useTdpScholarFormStore } from "~/stores/TdpScholarForm.store";

definePageMeta({
	layout: "user-header",
});

const formStore = useTdpScholarFormStore();
const toast = useToast();

/* -------------------------
   STEP CONTROL
-------------------------- */
const currentStep = ref(1);
const totalSteps = 4;

const steps = ref([
	{ id: 1, title: "Student Information", icon: "i-lucide-user", done: false },
	{ id: 2, title: "Address Information", icon: "i-lucide-map-pin", done: false },
	{ id: 3, title: "School Information", icon: "i-lucide-graduation-cap", done: false },
	{ id: 4, title: "Family Information", icon: "i-lucide-users", done: false },
]);

/* -------------------------
   NAVIGATION
-------------------------- */
function nextStep() {
	if (currentStep.value < totalSteps) {
		const step = steps.value[currentStep.value - 1];

		if (step) {
			step.done = true;
		}

		currentStep.value++;
	}
}

function prevStep() {
	if (currentStep.value > 1) {
		currentStep.value--;
	}
}
/* -------------------------
   VALIDATION
-------------------------- */
type FormSection = Record<string, string | number | null | undefined>;

function getMissingFields() {
	const missing: string[] = [];

	const check = (obj: FormSection, prefix: string) => {
		for (const key in obj) {
			const value = obj[key];

			if (
				prefix === "Family" &&
				key === "financialAidSpecify" &&
				formStore.family.financialAid !== "Yes"
			) {
				continue;
			}

			if (
				value === null ||
				value === undefined ||
				(typeof value === "string" && value.trim() === "")
			) {
				missing.push(`${prefix} - ${key}`);
			}
		}
	};

	check(formStore.student, "Student");
	check(formStore.address, "Address");
	check(formStore.school, "School");
	check(formStore.father, "Father");
	check(formStore.mother, "Mother");
	check(formStore.family, "Family");

	return missing;
}

/* -------------------------
   SUBMIT
-------------------------- */
function submitTdpForm() {
	console.log("SUBMIT PAYLOAD:", formStore);

	toast.add({
		title: "Application Submitted",
		description: "Your TDP application has been successfully submitted.",
		color: "success",
	});
}

/* -------------------------
   FINAL VALIDATION
-------------------------- */
function onSubmitClick() {
	const missingFields = getMissingFields();

	if (missingFields.length > 0) {
		toast.add({
			title: "Incomplete Form",
			description: `Please fill: ${missingFields.slice(0, 3).join(", ")}${
				missingFields.length > 3 ? "..." : ""
			}`,
			color: "error",
		});
		return;
	}

	toast.add({
		title: "Confirm Submission",
		description: "All fields are complete. Submit now?",
		color: "primary",
		actions: [
			{
				label: "Submit",
				color: "primary",
				onClick: () => submitTdpForm(),
			},
			{
				label: "Cancel",
				color: "neutral",
			},
		],
	});
}
</script>

<template>
	<div class="max-w-6xl mx-auto p-4 sm:p-6">
		<div class="grid grid-cols-1 md:grid-cols-12 gap-6">
			<!-- LEFT SIDEBAR STEPPER -->
			<div class="md:col-span-4">
				<UCard class="h-full border border-slate-200 dark:border-slate-800">
					<h2 class="text-lg font-semibold text-emerald-700">Scholarship Application</h2>

					<p class="text-xs text-slate-500 mb-4">Complete all required steps</p>

					<div class="space-y-2">
						<div
							v-for="step in steps"
							:key="step.id"
							class="flex items-center gap-3 p-3 rounded-lg cursor-pointer"
							:class="{
								'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200':
									currentStep === step.id,
								'hover:bg-slate-50 dark:hover:bg-slate-800': currentStep !== step.id,
							}"
							@click="currentStep = step.id"
						>
							<div
								class="p-2 rounded-md"
								:class="{
									'bg-emerald-600 text-white': currentStep === step.id,
									'bg-slate-200 dark:bg-slate-700': currentStep !== step.id,
								}"
							>
								<UIcon
									:name="step.icon"
									class="size-4"
								/>
							</div>

							<div class="flex-1">
								<p class="text-sm font-medium">
									{{ step.title }}
								</p>
								<p class="text-xs text-slate-500">Step {{ step.id }}</p>
							</div>

							<UIcon
								v-if="step.done"
								name="i-lucide-check-circle"
								class="text-emerald-600 size-5"
							/>
						</div>
					</div>

					<!-- PROGRESS -->
					<div class="mt-6">
						<div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
							<div
								class="bg-emerald-500 h-2 rounded-full transition-all"
								:style="{ width: (currentStep / totalSteps) * 100 + '%' }"
							/>
						</div>
					</div>
				</UCard>
			</div>

			<!-- RIGHT CONTENT -->
			<div class="md:col-span-8">
				<UCard class="border border-slate-200 dark:border-slate-800 min-h-[500px]">
					<h2 class="text-xl font-semibold mb-4">
						{{ steps[currentStep - 1]?.title }}
					</h2>

					<!-- STEPS -->
					<StudentInformation
						v-if="currentStep === 1"
						:store="formStore"
					/>
					<AddressInformation
						v-if="currentStep === 2"
						:store="formStore"
					/>
					<SchoolInformation
						v-if="currentStep === 3"
						:store="formStore"
					/>
					<FamilyInformation
						v-if="currentStep === 4"
						:store="formStore"
					/>

					<!-- NAV -->
					<div class="flex justify-between mt-6">
						<UButton
							v-if="currentStep > 1"
							color="neutral"
							variant="soft"
							icon="i-lucide-arrow-left"
							@click="prevStep"
						>
							Back
						</UButton>

						<div class="ml-auto flex gap-2">
							<UButton
								v-if="currentStep < totalSteps"
								color="success"
								icon="i-lucide-arrow-right"
								@click="nextStep"
							>
								Next
							</UButton>

							<UButton
								v-else
								color="success"
								icon="i-lucide-send"
								@click="onSubmitClick"
							>
								Submit
							</UButton>
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>
