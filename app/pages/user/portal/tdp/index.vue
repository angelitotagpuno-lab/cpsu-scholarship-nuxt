<script setup lang="ts">
import StudentInformation from "./components/StudentInformation.vue";
import AddressInformation from "./components/AddressInformation.vue";
import SchoolInformation from "./components/SchoolInformation.vue";
import FamilyInformation from "./components/FamilyInformation.vue";
import RequirementsForm from "./components/RequirementsForm.vue";
import { useTdpScholarFormStore } from "~/stores/TdpScholarForm.store";
import { tdpService } from "~/services/tdp.service";

definePageMeta({
	layout: "user-header",
});

const formStore = useTdpScholarFormStore();

function submitTdpForm() {
	const payload = {
		...formStore.student,
		...formStore.address,
		...formStore.school,
		...formStore.father,
		...formStore.mother,
		...formStore.family,
	};

	tdpService
		.store(payload)
		.then((res) => {
			console.log(res);

			// ✅ SUCCESS MESSAGE
			alert("Application submitted successfully!");

			// ✅ OPTIONAL: RESET FORM
			Object.assign(formStore.student, {
				lastName: "",
				firstName: "",
				middleName: "",
				maidenName: "",
				birthdate: "",
				sex: "",
				birthPlace: "",
				citizenship: "",
				mobile: "",
				email: "",
			});

			Object.assign(formStore.address, {
				street: "",
				city: "",
				province: "",
				zipCode: "",
			});

			Object.assign(formStore.school, {
				schoolName: "",
				schoolId: "",
				schoolAddress: "",
				schoolSector: "",
				yearLevel: "",
				course: "",
			});

			Object.assign(formStore.father, {
				fatherName: "",
				fatherOccupation: "",
				fatherStatus: "",
			});

			Object.assign(formStore.mother, {
				motherName: "",
				motherOccupation: "",
				motherStatus: "",
			});

			Object.assign(formStore.family, {
				income: "",
				siblings: "",
				financialAid: "",
			});
		})
		.catch((err) => {
			console.error(err);

			// ❌ ERROR MESSAGE
			alert("Failed to submit application!");
		});
}
</script>

<template>
	<div class="max-w-6xl mx-auto p-4 sm:p-6">
		<!-- CARD CONTAINER -->
		<div
			class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-8"
		>
			<!-- TITLE -->
			<div class="space-y-1">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
					TDP Scholarship Application
				</h2>
				<p class="text-gray-500 dark:text-gray-400 text-sm">
					Fill out the required information below
				</p>
			</div>

			<!-- STUDENT INFO -->
			<StudentInformation :store="formStore" />

			<!-- ADDRESS INFO -->
			<AddressInformation :store="formStore" />

			<!-- SCHOOL INFO -->
			<SchoolInformation :store="formStore" />

			<!-- FAMILY INFO -->
			<FamilyInformation :store="formStore" />

			<!-- REQUIREMENTS -->
			<RequirementsForm :store="formStore" />

			<!-- SUBMIT -->
			<div class="pt-4 flex justify-center sm:justify-start">
				<UButton
					block
					size="lg"
					color="primary"
					class="w-full sm:w-auto"
					@click="submitTdpForm"
				>
					Submit Application
				</UButton>
			</div>
		</div>
	</div>
	<LoginFooter />
</template>

<style scoped>
/* Style placeholders and inputs for better visibility */
input::placeholder,
select::placeholder {
	color: #9ca3af; /* Tailwind gray-400 */
	opacity: 1;
}

/* Make input boxes taller and full width */
input,
select,
textarea {
	width: 100%;
	min-height: 2.5rem; /* Taller input for easier typing */
	padding: 0.5rem 0.75rem;
	border-radius: 0.5rem;
}

/* Dark mode input */
.dark input,
.dark select,
.dark textarea {
	background-color: #1f2937; /* gray-800 */
	border-color: #374151; /* gray-700 */
	color: #f9fafb; /* white */
}

/* Hover effect for dark/light mode */
input:hover,
select:hover,
textarea:hover {
	border-color: #2563eb; /* blue-600 */
}
</style>
