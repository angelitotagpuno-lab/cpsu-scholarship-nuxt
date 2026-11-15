export interface ScholarshipProgram {
	id: string;
	name: string;
	description: string | null;
	isArchived: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateScholarshipProgramPayload {
	name: string;
	description?: string | null;
	isArchived?: boolean;
}

export interface UpdateScholarshipProgramPayload {
	name?: string;
	description?: string | null;
	isArchived?: boolean;
}

export interface ScholarshipProgramMeta {
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface ScholarshipProgramListResponse {
	data: ScholarshipProgram[];
	meta: ScholarshipProgramMeta;
}

export interface ScholarshipProgramQuery {
	page?: number;
	perPage?: number;
	search?: string;
	sort?: "name" | "createdAt";
	order?: "asc" | "desc";
}
