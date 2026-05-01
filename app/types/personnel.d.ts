export interface Personnel {
	id?: string;
	email?: string; // ✅ add this

	first_name?: string;
	last_name?: string;
	middle_name?: string;
	sex?: "male" | "female";

	position?: string;
	department?: string;

  role?: "admin" | "student" | "personnel";

	password?: string; // ✅ optional (ONLY for forms)
}
