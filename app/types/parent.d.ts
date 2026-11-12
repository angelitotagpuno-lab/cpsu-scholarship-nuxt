export type ParentType = "father" | "mother" | "guardian";

export interface Parent {
	id?: string;
	studentId?: string;
	type?: ParentType;
	firstName?: string;
	middleName?: string;
	lastName?: string;
	extName?: string;
	occupation?: string;
	monthlyIncome?: string;
	contactNumber?: string;
	email?: string;
}
