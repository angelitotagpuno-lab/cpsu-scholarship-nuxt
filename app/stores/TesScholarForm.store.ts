import { defineStore } from "pinia";
import { ref } from "vue";

export const useTesScholarFormStore = defineStore("TesScholarForm", () => {
	// Address
	const address = ref({
		streetBarangay: "",
		zipcode: "",
		city: "",
		province: "",
	});

	// Contact
	const contact = ref({
		contactNumber: "",
		email: "",
	});

	// Student
	const student = ref({
		studentId: "",
		lastName: "",
		firstName: "",
		middleName: "",
		extName: "",
		birthdate: "",
		sex: "",
		yearLevel: "",
		program: "",
	});

	// Father
	const father = ref({
		fatherLastName: "",
		fatherFirstName: "",
		fatherMiddleName: "",
		fatherOccupation: "",
		fatherIncome: "",
	});

	// Mother
	const mother = ref({
		motherLastName: "",
		motherFirstName: "",
		motherMiddleName: "",
		motherOccupation: "",
		motherIncome: "",
	});

	// Other info
	const other = ref({
		disability: "",
		indigenous: "",
		fourPs: "",
		pwdFile: null as File | null,
		ipFile: null as File | null,
		fourPsFile: null as File | null,
	});

	function resetAll() {
		address.value = { streetBarangay: "", zipcode: "", city: "", province: "" };
		contact.value = { contactNumber: "", email: "" };
		student.value = {
			studentId: "",
			lastName: "",
			firstName: "",
			middleName: "",
			extName: "",
			birthdate: "",
			sex: "",
			yearLevel: "",
			program: "",
		};
		father.value = {
			fatherLastName: "",
			fatherFirstName: "",
			fatherMiddleName: "",
			fatherOccupation: "",
			fatherIncome: "",
		};
		mother.value = {
			motherLastName: "",
			motherFirstName: "",
			motherMiddleName: "",
			motherOccupation: "",
			motherIncome: "",
		};
		other.value = {
			disability: "",
			indigenous: "",
			fourPs: "",
			pwdFile: null,
			ipFile: null,
			fourPsFile: null,
		};
	}

	return { address, contact, student, father, mother, other, resetAll };
});
