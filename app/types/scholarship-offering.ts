export type OfferingStatus = "draft" | "open" | "closed" | "archived";

export interface ScholarshipOffering {
	id: string;

	programId: string;

	academicYear: string;
	semester: "1" | "2";

	allocatedBudget: number;
	availableSlots?: number | null;

	applicationStartAt?: string | null;
	applicationEndAt?: string | null;

	status: OfferingStatus;

	createdAt?: string;
	updatedAt?: string;
}

// CREATE
export interface CreateScholarshipOfferingPayload {
	programId: string;
	academicYear: string;
	semester: "1" | "2";
	allocatedBudget: number;
	availableSlots?: number | null;
	applicationStartAt?: string | null;
	applicationEndAt?: string | null;
	status?: OfferingStatus;
}

// UPDATE
export interface UpdateScholarshipOfferingPayload {
	programId?: string;
	academicYear?: string;
	semester?: "1" | "2";
	allocatedBudget?: number;
	availableSlots?: number | null;
	applicationStartAt?: string | null;
	applicationEndAt?: string | null;
	status?: OfferingStatus;
}
