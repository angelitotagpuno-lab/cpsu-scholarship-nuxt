<script setup lang="ts">
import { ref } from "vue";
import StudentInformation from "./components/StudentInformation.vue";
import AddressInformation from "./components/AddressInformation.vue";
import SchoolInformation from "./components/SchoolInformation.vue";
import FamilyInformation from "./components/FamilyInformation.vue";
import SubmitModal from "./components/SubmitModal.vue";
import { useTdpScholarFormStore } from "~/stores/TdpScholarForm.store";

definePageMeta({
	layout: "user-header",
});

const formStore = useTdpScholarFormStore();
const toast = useToast();

const isConfirmOpen = ref(false);

// CHECK IF FORM IS COMPLETE
type FormSection = Record<string, string | number | null | undefined>;

function getMissingFields() {
	const missing: string[] = [];

	const check = (obj: FormSection, prefix: string) => {
		for (const key in obj) {
			const value = obj[key];

			// skip conditional field
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

// SUBMIT CLICK (VALIDATION FIRST)
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

		isConfirmOpen.value = false;
		return;
	}

	// OPEN CONFIRMATION MODAL ONLY IF VALID
	isConfirmOpen.value = true;
}

// FINAL SUBMIT
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

	isConfirmOpen.value = false;

	toast.add({
		title: "Application Submitted",
		description: "Your TDP application has been successfully submitted.",
		color: "success",
	});
}
</script>

<template>
	<div class="max-w-6xl mx-auto p-4 sm:p-6">
		<UCard class="space-y-8">
			<!-- TITLE -->
			<div class="space-y-1">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
					TDP Scholarship Application
				</h2>
				<p class="text-gray-500 dark:text-gray-400 text-sm">
					Fill out the required information below
				</p>
			</div>

			<!-- FORMS -->
			<StudentInformation :store="formStore" />
			<AddressInformation :store="formStore" />
			<SchoolInformation :store="formStore" />
			<FamilyInformation :store="formStore" />
			<RequirementsForm :store="formStore" />

			<!-- SUBMIT BUTTON -->
			<div class="pt-4 flex justify-center sm:justify-start">
				<UButton
					size="lg"
					block
					color="primary"
					class="w-full sm:w-auto"
					@click="onSubmitClick"
				>
					Submit Application
				</UButton>
			</div>
		</UCard>

		<!-- CONFIRMATION MODAL -->
		<SubmitModal
			v-model="isConfirmOpen"
			@confirm="submitTdpForm"
		/>
	</div>
</template>
