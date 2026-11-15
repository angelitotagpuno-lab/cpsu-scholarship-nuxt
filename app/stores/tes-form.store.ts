import { defineStore } from "pinia";
import { reactive } from "vue";

function initialStudent() {
	return {
		studentId: "",
		firstName: "",
		lastName: "",
		middleName: "",
		extName: "",
		sex: "",
		birthdate: "",
		birthplace: "",
		citizenship: "Filipino",
		yearLevel: "",
		program: "",
		courseId: "",
		gwa: "",
		numberOfSiblings: "",
		schoolSector: "",
		schoolName: "",
		schoolAddress: "",
	};
}

function initialFather() {
	return {
		fatherFirstName: "",
		fatherLastName: "",
		fatherMiddleName: "",
		fatherOccupation: "",
		fatherIncome: "",
		fatherStatus: "" as "living" | "deceased" | "unknown" | "",
	};
}

function initialMother() {
	return {
		motherFirstName: "",
		motherLastName: "",
		motherMiddleName: "",
		motherOccupation: "",
		motherIncome: "",
		motherStatus: "" as "living" | "deceased" | "unknown" | "",
	};
}

function initialAddress() {
	return {
		streetBarangay: "",
		street: "",
		barangay: "",
		cityMunicipality: "",
		province: "",
		zipcode: "",
	};
}

function initialContact() {
	return {
		contactNumber: "",
		email: "",
	};
}

function initialOther() {
	return {
		disability: "",
		indigenous: "",
		fourPs: "",
		pwdFile: null as File | null,
		ipFile: null as File | null,
		fourPsFile: null as File | null,
	};
}

export const useTesScholarFormStore = defineStore("tes-scholar-form", () => {
	const student = reactive(initialStudent());
	const father = reactive(initialFather());
	const mother = reactive(initialMother());
	const address = reactive(initialAddress());
	const contact = reactive(initialContact());
	const other = reactive(initialOther());

	function resetAll() {
		Object.assign(student, initialStudent());
		Object.assign(father, initialFather());
		Object.assign(mother, initialMother());
		Object.assign(address, initialAddress());
		Object.assign(contact, initialContact());
		Object.assign(other, initialOther());
	}

	return {
		student,
		father,
		mother,
		address,
		contact,
		other,
		resetAll,
	};
});
