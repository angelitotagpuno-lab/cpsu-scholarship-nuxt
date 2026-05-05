import type { ApiResponse } from "~/types/api-response";
import type {
	ScholarshipProgram,
	CreateScholarshipProgramPayload,
	UpdateScholarshipProgramPayload,
} from "~/types/scholarship";

const baseUrl = "/proxy";

// index
function index(): Promise<ApiResponse<ScholarshipProgram[]>> {
	return $fetch(baseUrl + "/api/scholarship-programs", {
		method: "GET",
		credentials: "include",
	});
}

// show
function show(id: string): Promise<ApiResponse<ScholarshipProgram>> {
	return $fetch(baseUrl + `/api/scholarship-programs/${id}`, {
		method: "GET",
		credentials: "include",
	});
}

// store
function store(body: CreateScholarshipProgramPayload): Promise<ApiResponse<ScholarshipProgram>> {
	return $fetch(baseUrl + "/api/scholarship-programs", {
		method: "POST",
		body,
		credentials: "include",
	});
}

// update
function update(
	id: string,
	body: UpdateScholarshipProgramPayload,
): Promise<ApiResponse<ScholarshipProgram>> {
	return $fetch(baseUrl + `/api/scholarship-programs/${id}`, {
		method: "PUT",
		body,
		credentials: "include",
	});
}

// destroy
function destroy(id: string): Promise<ApiResponse<ScholarshipProgram>> {
	return $fetch(baseUrl + `/api/scholarship-programs/${id}`, {
		method: "DELETE",
		credentials: "include",
	});
}

export const scholarshipService = {
	index,
	show,
	store,
	update,
	destroy,
};
