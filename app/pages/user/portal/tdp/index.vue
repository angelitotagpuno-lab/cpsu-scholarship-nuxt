<script setup lang="ts">
import StudentInformation from "./components/StudentInformation.vue";
import AddressInformation from "./components/AddressInformation.vue";
import SchoolInformation from "./components/SchoolInformation.vue";
import FamilyInformation from "./components/FamilyInformation.vue";
import RequirementsForm from "./components/RequirementsForm.vue";

import { useTdpScholarFormStore } from "~/stores/TdpScholarForm.store";

definePageMeta({
	layout: "user-header",
});

const formStore = useTdpScholarFormStore();

function submitTdpForm() {
	console.log({
		student: formStore.student,
		address: formStore.address,
		school: formStore.school,
		father: formStore.father,
		mother: formStore.mother,
		family: formStore.family,
		requirements: formStore.requirements,
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
