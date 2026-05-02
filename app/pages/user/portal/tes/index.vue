<script setup lang="ts">
import StudentInformation from "./components/StudentInformation.vue";
import FatherInformation from "./components/FatherInformation.vue";
import MotherInformation from "./components/MotherInformation.vue";
import AddressInformation from "./components/AddressInformation.vue";
import OtherInformation from "./components/OtherInformation.vue";
import ContactInformation from "./components/ContactInformation.vue";

import { useTesScholarFormStore } from "~/stores/TesScholarForm.store";

definePageMeta({
	layout: "user-header",
});

const formStore = useTesScholarFormStore();
const toast = useToast();

/* -------------------------
   STEPS (IMPROVED ICONS)
-------------------------- */
const currentStep = ref(1);

const steps = [
	{ id: 1, title: "Student Information", icon: "i-lucide-user-round" },
	{ id: 2, title: "Parents Information", icon: "i-lucide-heart-handshake" },
	{ id: 3, title: "Address Information", icon: "i-lucide-home" },
	{ id: 4, title: "Other Information", icon: "i-lucide-clipboard-list" },
	{ id: 5, title: "Contact Information", icon: "i-lucide-phone" },
];

const totalSteps = steps.length;

function nextStep() {
	if (currentStep.value < totalSteps) currentStep.value++;
}

function prevStep() {
	if (currentStep.value > 1) currentStep.value--;
}

/* -------------------------
   VALIDATION
-------------------------- */
function getMissingFields() {
	const missing: string[] = [];

	const s = formStore.student;
	const a = formStore.address;
	const c = formStore.contact;
	const f = formStore.father;
	const m = formStore.mother;
	const o = formStore.other;

	if (!s.studentId) missing.push("Student ID");
	if (!s.lastName) missing.push("Last Name");
	if (!s.firstName) missing.push("First Name");
	if (!s.birthdate) missing.push("Birthdate");
	if (!s.sex) missing.push("Sex");
	if (!s.yearLevel) missing.push("Year Level");
	if (!s.program) missing.push("Program");

	if (!f.fatherLastName) missing.push("Father Last Name");
	if (!m.motherLastName) missing.push("Mother Last Name");

	if (!a.streetBarangay) missing.push("Address");
	if (!c.contactNumber) missing.push("Contact Number");

	if (o.disability === "Yes" && !o.pwdFile) missing.push("PWD Proof");
	if (o.indigenous === "Yes" && !o.ipFile) missing.push("IP Proof");
	if (o.fourPs === "Yes" && !o.fourPsFile) missing.push("4Ps Proof");

	return missing;
}

/* -------------------------
   SUBMIT
-------------------------- */
function submitForm() {
	toast.add({
		title: "Submitted",
		description: "TES application submitted successfully",
		color: "success",
	});

	formStore.resetAll();
}

function onSubmitClick() {
	const missing = getMissingFields();

	if (missing.length) {
		toast.add({
			title: "Incomplete Form",
			description: `Missing: ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? "..." : ""}`,
			color: "error",
		});
		return;
	}

	toast.add({
		title: "Confirm Submission",
		description: "Submit TES application?",
		color: "primary",
		actions: [{ label: "Submit", onClick: submitForm }, { label: "Cancel" }],
	});
}
</script>

<template>
	<div class="max-w-6xl mx-auto p-4 sm:p-6">
		<div class="grid grid-cols-1 md:grid-cols-12 gap-6">
			<!-- SIDEBAR STEPPER -->
			<div class="md:col-span-4">
				<UCard class="border border-slate-200 dark:border-slate-800">
					<h2 class="font-semibold text-emerald-700 mb-4">TES Application Wizard</h2>

					<div class="space-y-2">
						<div
							v-for="step in steps"
							:key="step.id"
							class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition"
							:class="{
								'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200':
									currentStep === step.id,
								'hover:bg-slate-50 dark:hover:bg-slate-800': currentStep !== step.id,
							}"
							@click="currentStep = step.id"
						>
							<!-- ICON -->
							<div
								class="p-2 rounded-lg"
								:class="{
									'bg-emerald-600 text-white': currentStep === step.id,
									'bg-slate-100 dark:bg-slate-800 text-slate-500': currentStep !== step.id,
								}"
							>
								<UIcon
									:name="step.icon"
									class="size-5"
								/>
							</div>

							<!-- TITLE -->
							<div class="flex-1">
								<p class="text-sm font-medium">
									{{ step.title }}
								</p>
								<p class="text-xs text-slate-400">Step {{ step.id }}</p>
							</div>

							<!-- DONE ICON -->
							<UIcon
								v-if="currentStep > step.id"
								name="i-lucide-check-circle"
								class="text-emerald-500 size-5"
							/>
						</div>
					</div>

					<!-- PROGRESS -->
					<div class="mt-5">
						<div class="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
							<div
								class="h-2 bg-emerald-500 transition-all"
								:style="{ width: (currentStep / totalSteps) * 100 + '%' }"
							/>
						</div>

						<p class="text-xs text-slate-400 mt-2">Step {{ currentStep }} of {{ totalSteps }}</p>
					</div>
				</UCard>
			</div>

			<!-- MAIN CONTENT -->
			<div class="md:col-span-8">
				<UCard class="min-h-[500px]">
					<h2 class="text-lg font-semibold mb-4">
						{{ steps[currentStep - 1]?.title }}
					</h2>

					<!-- STEPS -->
					<StudentInformation v-if="currentStep === 1" />

					<div v-if="currentStep === 2">
						<FatherInformation />
						<MotherInformation />
					</div>

					<AddressInformation v-if="currentStep === 3" />
					<OtherInformation v-if="currentStep === 4" />
					<ContactInformation v-if="currentStep === 5" />

					<!-- NAV -->
					<div class="flex justify-between mt-6">
						<UButton
							v-if="currentStep > 1"
							variant="soft"
							icon="i-lucide-arrow-left"
							@click="prevStep"
						>
							Back
						</UButton>

						<div class="ml-auto flex gap-2">
							<UButton
								v-if="currentStep < totalSteps"
								color="primary"
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
