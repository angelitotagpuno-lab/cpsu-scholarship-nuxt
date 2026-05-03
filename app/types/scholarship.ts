export interface ScholarshipProgram {
	id: string;
	code?: string;
	name: string;
	description?: string | null;
	intakeType: "public_application" | "staff_nomination";
	defaultAmountPerSemester: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export type CreateScholarshipProgram = Omit<ScholarshipProgram, "id" | "createdAt" | "updatedAt">;

export type UpdateScholarshipProgram = Partial<CreateScholarshipProgram>;
