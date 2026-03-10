<script setup lang="ts">
import { reactive } from "vue";

import StudentInformation from "./components/StudentInformation.vue";
import FatherInformation from "./components/FatherInformation.vue";
import MotherInformation from "./components/MotherInformation.vue";
import AddressInformation from "./components/AddressInformation.vue";
import OtherInformation from "./components/OtherInformation.vue";
import ContactInformation from "./components/ContactInformation.vue";

definePageMeta({
	layout: "user-header",
});

const state = reactive({
	studentId: "",
	lastName: "",
	firstName: "",
	middleName: "",
	extName: "",
	sex: "",
	birthdate: "",
	program: "",
	yearLevel: "",

	fatherLastName: "",
	fatherFirstName: "",
	fatherMiddleName: "",
	fatherOccupation: "",
	fatherIncome: "",

	motherLastName: "",
	motherFirstName: "",
	motherMiddleName: "",
	motherOccupation: "",
	motherIncome: "",

	streetBarangay: "",
	zipcode: "",

	disability: "",
	indigenous: "",
	fourPs: "",
	enrolled: "",

	contactNumber: "",
});

function submitForm() {
	console.log("Application Data:", state);
}
</script>

<template>
	<div class="flex justify-center p-4 sm:p-6">
		<UPageCard class="w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
			<UForm
				:state="state"
				class="space-y-6 sm:space-y-8 px-2 sm:px-6"
				@submit="submitForm"
			>
				<!-- All the sections -->
				<StudentInformation v-model="state" />
				<FatherInformation v-model="state" />
				<MotherInformation v-model="state" />
				<AddressInformation v-model="state" />
				<OtherInformation v-model="state" />
				<ContactInformation v-model="state" />

				<!-- Submit Button -->
				<div class="pt-4">
					<UButton
						type="submit"
						block
						size="lg"
						class="w-full sm:w-auto"
					>
						Submit TES Application
					</UButton>
				</div>
			</UForm>
		</UPageCard>
	</div>

	<LoginFooter />
</template>
