export interface Personnel {
	id?: number;
	last_name?: string;
	middle_name?: string;
	sex?: "male" | "female";
	position?: string;
	department?: string;
	role?: "admin" | "staff";
}
