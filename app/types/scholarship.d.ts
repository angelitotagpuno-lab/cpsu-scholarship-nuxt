export type IntakeType = "public_application" | "staff_nomination";

export interface ScholarshipProgram {
	id: string;

	code?: string | null;
	name: string;
	description?: string | null;

	intake_type: IntakeType;

	default_amount_per_semester: number;

	is_active: boolean;

	created_at: string;
	updated_at: string;
}

// For CREATE
export interface CreateScholarshipProgramPayload {
	code?: string;
	name: string;
	description?: string;
	intakeType: IntakeType;
	defaultAmountPerSemester: number;
	isActive?: boolean;
}

// For UPDATE (partial)
export interface UpdateScholarshipProgramPayload {
	code?: string;
	name?: string;
	description?: string;
	intakeType?: IntakeType;
	defaultAmountPerSemester?: number;
	isActive?: boolean;
}
