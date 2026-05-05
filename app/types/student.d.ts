export type StudentSex = "male" | "female";

export type ParentType = "father" | "mother" | "guardian";

export interface StudentAddress {
	id?: string;
	studentId?: string;
	personnelId?: string;

	street?: string;
	barangay: string;
	city: string;
	province: string;
	zipcode: string;

	createdAt?: string;
}

export interface StudentParent {
	id?: string;
	studentId?: string;

	type: ParentType;
	firstName: string;
	lastName: string;
	middleName?: string;
	extName?: string;
	occupation?: string;
	monthlyIncome?: string;
	contactNumber?: string;
	email?: string;

	createdAt?: string;
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

	email?: string;
	birthdate: string;
	contactNumber: string;
	sex: StudentSex;
	yearLevel: number;
	isActive?: boolean;
	courseId?: string;
	createdAt?: string;

	address: StudentAddress;
	parents: StudentParent[];
}
