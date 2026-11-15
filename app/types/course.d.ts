export interface Course {
	id: string;
	name: string;
	abbreviation: string;
	major: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CourseBody {
	name: string;
	abbreviation: string;
	major?: string | null;
}

export interface CourseQuery {
	page?: number;
	perPage?: number;
	search?: string;
	sort?: "name" | "createdAt";
	order?: "asc" | "desc";
}

export interface CourseListResponse {
	data: Course[];
	meta: {
		total: number;
		page: number;
		perPage: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}
