export interface ScholarshipOffering {
	id: string;
	scholarshipProgramId: string | null;
	schoolYear: string;
	totalBudget: string;
	amountPerSemester: string;
	pwdAdditional: string;
	isActive: boolean;
	isArchived: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateScholarshipOfferingPayload {
	scholarshipProgramId?: string | null;
	schoolYear: string;
	totalBudget: string;
	amountPerSemester: string;
	pwdAdditional: string;
}

export interface UpdateScholarshipOfferingPayload {
	scholarshipProgramId?: string | null;
	schoolYear?: string;
	totalBudget?: string;
	amountPerSemester?: string;
	pwdAdditional?: string;
	isActive?: boolean;
	isArchived?: boolean;
}

export interface ScholarshipOfferingQuery {
	page?: number;
	perPage?: number;
	search?: string;
	sort?: "schoolYear" | "createdAt";
	order?: "asc" | "desc";
}

export interface ScholarshipOfferingMeta {
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface ScholarshipOfferingListResponse {
	data: ScholarshipOffering[];
	meta: ScholarshipOfferingMeta;
}

export interface ScholarshipOfferingCursorQuery {
	cursor?: string;
	perPage?: number;
	direction?: "next" | "prev";
}

export interface ScholarshipOfferingCursorResponse {
	data: ScholarshipOffering[];
	meta: {
		nextCursor: string | null;
		prevCursor: string | null;
		hasNext: boolean;
		hasPrev: boolean;
		perPage: number;
	};
}
