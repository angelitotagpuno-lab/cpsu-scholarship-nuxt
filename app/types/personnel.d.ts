export interface Personnel {
	id: string;
	userId: string;
	firstName: string;
	lastName: string;
	department: string;
	position: string;
	contactNumber: string | null;
	createdAt: string;
	updatedAt: string;
	role: "personnel";
}

export interface CreatePersonnel {
	firstName: string;
	lastName: string;
	department: string;
	position: string;
	contactNumber?: string | null;
	email: string;
	password: string;
}

export interface UpdatePersonnel {
	firstName?: string;
	lastName?: string;
	department?: string;
	position?: string;
	contactNumber?: string | null;
}

export interface PersonnelMeta {
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface PersonnelListResponse {
	data: Personnel[];
	meta: PersonnelMeta;
}

export interface PersonnelQuery {
	page?: number;
	perPage?: number;
	search?: string;
	sort?: "firstName" | "lastName" | "createdAt";
	order?: "asc" | "desc";
}
