import { defineStore } from "pinia";
import { ref } from "vue";

export interface TdpParent {
	type: "father" | "mother" | "guardian";
	firstName: string;
	lastName: string;
	status: "living" | "deceased" | "unknown" | "";
	occupation: string;
	monthlyIncome: string;
}

export interface TdpForm {
	studentId: string;
	profile: {
		firstName: string;
		lastName: string;
		birthdate: string;
		birthplace: string;
		contactNumber: string;
		sex: string;
		email: string;
		citizenship: string;
		gwa: string;
		yearLevel: string;
		courseId: string;
		address: {
			street: string;
			barangay: string;
			city: string;
			province: string;
			zipcode: string;
		};
		parents: [TdpParent, TdpParent];
		school: {
			schoolName: string;
			schoolAddress: string;
			schoolId: string;
			schoolSector: string;
		};
		family: {
			income: string;
			siblings: string;
			financialAid: string;
			financialAidSpecify: string;
		};
	};
	documentFile: File | null;
}

function initialForm(): TdpForm {
	return {
		studentId: "",
		profile: {
			firstName: "",
			lastName: "",
			birthdate: "",
			birthplace: "",
			contactNumber: "",
			sex: "",
			email: "",
			citizenship: "Filipino",
			gwa: "",
			yearLevel: "",
			courseId: "",
			address: {
				street: "",
				barangay: "",
				city: "",
				province: "",
				zipcode: "",
			},
			parents: [
				{
					type: "father",
					firstName: "",
					lastName: "",
					status: "",
					occupation: "",
					monthlyIncome: "",
				},
				{
					type: "mother",
					firstName: "",
					lastName: "",
					status: "",
					occupation: "",
					monthlyIncome: "",
				},
			],
			school: {
				schoolName: "",
				schoolAddress: "",
				schoolId: "",
				schoolSector: "",
			},
			family: {
				income: "",
				siblings: "",
				financialAid: "",
				financialAidSpecify: "",
			},
		},
		documentFile: null,
	};
}

export const useTdpFormStore = defineStore("tdp-form", () => {
	const item = ref<TdpForm>(initialForm());

	function reset() {
		item.value = initialForm();
	}

	return { item, reset };
});
