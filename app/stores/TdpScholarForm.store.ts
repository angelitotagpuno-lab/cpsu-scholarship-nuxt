// ~/stores/TdpScholarForm.store.ts
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useTdpScholarFormStore = defineStore("tdpScholarForm", () => {
	const student = reactive({
		lastName: "",
		firstName: "",
		middleName: "",
		// maidenName: "",
		birthdate: "",
		sex: "",
		birthPlace: "",
		citizenship: "",
		mobile: "",
		email: "",
	});

	const address = reactive({
		street: "",
		city: "",
		province: "",
		zipCode: "",
	});

	const school = reactive({
		schoolName: "",
		schoolId: "",
		schoolAddress: "",
		schoolSector: "",
		yearLevel: "",
		course: "",
	});

	const father = reactive({
		fatherName: "",
		fatherOccupation: "",
		fatherStatus: "",
	});

	const mother = reactive({
		motherName: "",
		motherOccupation: "",
		motherStatus: "",
	});

	const family = reactive({
		income: "",
		siblings: "",
		financialAid: "",
		financialAidSpecify: "",
	});

	const requirements = reactive({
		corCoe: null as File | null,
		certificateOfIndigency: null as File | null,
	});

	return { student, address, school, father, mother, family, requirements };
});
