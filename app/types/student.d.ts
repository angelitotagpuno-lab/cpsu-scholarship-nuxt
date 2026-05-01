export type StudentSex = "male" | "female";

export type ParentType = "father" | "mother" | "guardian";

export interface StudentAddress {
	street?: string;
	barangay: string;
	city: string;
	province: string;
	zipcode: string;
}

export interface StudentParent {
	type: ParentType;
	firstName: string;
	lastName: string;
	middleName?: string;
	contactNumber?: string;
	occupation?: string;
}

export interface Student {
	id?: string;
	userId?: string;
	studentId?: string;
	schoolId?: string;

	firstName: string;
	lastName: string;
	middleName?: string;
	extName?: string;

	birthdate: string;
	contactNumber: string;
	sex: StudentSex;
	yearLevel: number;

	address: StudentAddress;
	parents: StudentParent[];
}
