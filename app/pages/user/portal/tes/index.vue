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

	// Student
	if (!s.studentId) missing.push("Student ID");
	if (!s.lastName) missing.push("Last Name");
	if (!s.firstName) missing.push("First Name");
	if (!s.birthdate) missing.push("Birthdate");
	if (!s.sex) missing.push("Sex");
	if (!s.yearLevel) missing.push("Year Level");
	if (!s.program) missing.push("Program");

	// Address
	if (!a.streetBarangay) missing.push("Street/Barangay");
	if (!a.zipcode) missing.push("Zipcode");

	// Contact
	if (!c.contactNumber) missing.push("Contact Number");

	// Father
	if (!f.fatherLastName) missing.push("Father Last Name");

	// Mother
	if (!m.motherLastName) missing.push("Mother Last Name");

	// Conditional files
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
	<div class="flex justify-center p-4 sm:p-6">
		<UPageCard class="w-full max-w-6xl">
			<div class="space-y-6">
				<StudentInformation />
				<FatherInformation />
				<MotherInformation />
				<AddressInformation />
				<OtherInformation />
				<ContactInformation />

				<UButton
					block
					size="lg"
					@click="onSubmitClick"
				>
					Submit TES Application
				</UButton>
			</div>
		</UPageCard>
	</div>
</template>
