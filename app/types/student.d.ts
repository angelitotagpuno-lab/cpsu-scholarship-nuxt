export type Gender = "male" | "female";

export type YearLevel = "1" | "2" | "3" | "4" | "5" | "6";

export interface Student {
	id?: string;
	schoolId?: string;
	lastName?: string;
	firstName?: string;
	middleName?: string;
	extName?: string;
	sex?: Gender;
	birthdate?: string;
	contactNumber?: string;
	email?: string;
	yearLevel?: YearLevel;
	isActive?: boolean;
	address?: Address;
	parents?: Parent[];
}
