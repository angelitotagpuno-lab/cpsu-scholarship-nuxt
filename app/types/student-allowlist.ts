export interface StudentAllowlist {
	id: string;
	studentNumber: string;
	name: string;
	isRegistered: boolean;
	uploadedBy: string | null;
	registeredUserId: string | null;
	registeredAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface StudentAllowlistMeta {
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface StudentAllowlistResponse {
	data: StudentAllowlist[];
	meta: StudentAllowlistMeta;
}

export interface StudentAllowlistQuery {
	page?: number;
	perPage?: number;
	search?: string;
	sort?: "name" | "createdAt";
	order?: "asc" | "desc";
}

export interface StudentAllowlistImportError {
	row: number;
	message: string;
}

export interface StudentAllowlistImportResponse {
	totalRows: number;
	inserted: number;
	skipped: number;
	invalid: number;
	errors: StudentAllowlistImportError[];
}
