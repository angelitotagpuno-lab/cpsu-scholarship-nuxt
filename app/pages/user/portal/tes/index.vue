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

/**
 * VALIDATION
 */
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

	if (!a.streetBarangay) missing.push("Street/Barangay");
	if (!a.zipcode) missing.push("Zipcode");

	if (!c.contactNumber) missing.push("Contact Number");

	if (!f.fatherLastName) missing.push("Father Last Name");
	if (!m.motherLastName) missing.push("Mother Last Name");

	if (o.disability === "Yes" && !o.pwdFile) missing.push("PWD Proof");
	if (o.indigenous === "Yes" && !o.ipFile) missing.push("Indigenous Proof");
	if (o.fourPs === "Yes" && !o.fourPsFile) missing.push("4Ps Proof");

	return missing;
}

function submitForm() {
	console.log("TES DATA:", {
		student: formStore.student,
		address: formStore.address,
		contact: formStore.contact,
		father: formStore.father,
		mother: formStore.mother,
		other: formStore.other,
	});

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
		actions: [
			{
				label: "Submit",
				onClick: submitForm,
			},
			{
				label: "Cancel",
			},
		],
	});
}
</script>

<template>
	<div class="min-h-screen flex justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-900">
		<UPageCard
			class="w-full max-w-6xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6"
		>
			<!-- HEADER -->
			<div
				class="rounded-lg bg-emerald-50 p-5 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:ring-emerald-900"
			>
				<div class="flex items-start gap-3">
					<div class="rounded-md bg-emerald-600 p-2 text-white">
						<UIcon
							name="i-lucide-graduation-cap"
							class="size-5"
						/>
					</div>

					<div>
						<h1 class="text-base font-semibold text-slate-900 dark:text-white">
							TES Scholarship Application
						</h1>
						<p class="text-sm text-slate-500 dark:text-slate-400">
							Fill out all required information carefully before submitting
						</p>
					</div>
				</div>
			</div>

			<!-- SECTIONS -->
			<div class="space-y-6">
				<div class="space-y-3">
					<div class="flex items-center gap-2 font-semibold">
						<UIcon
							name="i-lucide-user"
							class="size-5 text-blue-600"
						/>
						Student Information
					</div>
					<StudentInformation />
				</div>

				<div class="border-t border-slate-200 dark:border-slate-800" />

				<div class="space-y-3">
					<div class="flex items-center gap-2 font-semibold">
						<UIcon
							name="i-lucide-users"
							class="size-5 text-rose-600"
						/>
						Parents Information
					</div>
					<FatherInformation />
					<MotherInformation />
				</div>

				<div class="border-t border-slate-200 dark:border-slate-800" />

				<div class="space-y-3">
					<div class="flex items-center gap-2 font-semibold">
						<UIcon
							name="i-lucide-map-pin"
							class="size-5 text-emerald-600"
						/>
						Address Information
					</div>
					<AddressInformation />
				</div>

				<div class="border-t border-slate-200 dark:border-slate-800" />

				<div class="space-y-3">
					<div class="flex items-center gap-2 font-semibold">
						<UIcon
							name="i-lucide-file-text"
							class="size-5 text-amber-600"
						/>
						Other Information
					</div>
					<OtherInformation />
				</div>

				<div class="border-t border-slate-200 dark:border-slate-800" />

				<div class="space-y-3">
					<div class="flex items-center gap-2 font-semibold">
						<UIcon
							name="i-lucide-phone"
							class="size-5 text-indigo-600"
						/>
						Contact Information
					</div>
					<ContactInformation />
				</div>
			</div>

			<!-- SUBMIT -->
			<div class="pt-2 flex justify-end">
				<UButton
					size="lg"
					color="primary"
					icon="i-lucide-send"
					class="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
					@click="onSubmitClick"
				>
					Submit TES Application
				</UButton>
			</div>
		</UPageCard>
	</div>
</template>
