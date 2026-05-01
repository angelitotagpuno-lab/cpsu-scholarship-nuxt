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

function submitTdpForm() {
	const payload = {
		student: formStore.student,
		address: formStore.address,
		school: formStore.school,
		father: formStore.father,
		mother: formStore.mother,
		family: formStore.family,
		requirements: formStore.requirements,
	};

	console.log("SUBMIT PAYLOAD:", payload);

	toast.add({
		title: "Application Submitted",
		description: "Your TDP application has been successfully submitted.",
		color: "success",
	});
}

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
		description: "All fields are complete. Do you want to submit now?",
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
		<UCard
			class="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-8"
		>
			<!-- HEADER -->
			<div
				class="rounded-lg bg-emerald-50 p-4 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:ring-emerald-900"
			>
				<div class="flex items-start gap-3">
					<div class="rounded-md bg-emerald-600 p-2 text-white">
						<UIcon
							name="i-lucide-file-text"
							class="size-5"
						/>
					</div>

					<div>
						<h2 class="text-base font-semibold text-slate-900 dark:text-white">
							TDP Scholarship Application
						</h2>
						<p class="text-sm text-slate-500 dark:text-slate-400">
							Fill out all required information carefully before submitting.
						</p>
					</div>
				</div>
			</div>

			<!-- FORMS -->
			<div class="space-y-6">
				<!-- STUDENT -->
				<div class="space-y-3">
					<div class="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
						<UIcon
							name="i-lucide-user"
							class="size-5 text-blue-600"
						/>
						Student Information
					</div>
					<StudentInformation :store="formStore" />
				</div>

				<div class="border-t border-slate-200 dark:border-slate-800" />

				<!-- ADDRESS -->
				<div class="space-y-3">
					<div class="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
						<UIcon
							name="i-lucide-map-pin"
							class="size-5 text-emerald-600"
						/>
						Address Information
					</div>
					<AddressInformation :store="formStore" />
				</div>

				<div class="border-t border-slate-200 dark:border-slate-800" />

				<!-- SCHOOL -->
				<div class="space-y-3">
					<div class="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
						<UIcon
							name="i-lucide-school"
							class="size-5 text-indigo-600"
						/>
						School Information
					</div>
					<SchoolInformation :store="formStore" />
				</div>

				<div class="border-t border-slate-200 dark:border-slate-800" />

				<!-- FAMILY -->
				<div class="space-y-3">
					<div class="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
						<UIcon
							name="i-lucide-users"
							class="size-5 text-rose-600"
						/>
						Family Information
					</div>
					<FamilyInformation :store="formStore" />
				</div>

				<div class="border-t border-slate-200 dark:border-slate-800" />
			</div>

			<!-- SUBMIT -->
			<div class="pt-2 flex justify-center sm:justify-end">
				<UButton
					size="lg"
					color="primary"
					icon="i-lucide-send"
					class="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
					@click="onSubmitClick"
				>
					Submit Application
				</UButton>
			</div>
		</UCard>
	</div>
</template>
