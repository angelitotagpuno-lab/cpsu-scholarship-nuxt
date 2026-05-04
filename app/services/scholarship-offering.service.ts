import type { ApiResponse } from "~/types/api-response";
import type {
	ScholarshipOffering,
	CreateScholarshipOfferingPayload,
	UpdateScholarshipOfferingPayload,
} from "~/types/scholarship-offering";

const baseUrl = "/proxy";

// index
function index(): Promise<ApiResponse<ScholarshipOffering[]>> {
	return $fetch(baseUrl + "/api/scholarship-offerings", {
		method: "GET",
		credentials: "include",
	});
}

// show
function show(id: string): Promise<ApiResponse<ScholarshipOffering>> {
	return $fetch(baseUrl + `/api/scholarship-offerings/${id}`, {
		method: "GET",
		credentials: "include",
	});
}

// store
function store(body: CreateScholarshipOfferingPayload): Promise<ApiResponse<ScholarshipOffering>> {
	return $fetch(baseUrl + "/api/scholarship-offerings", {
		method: "POST",
		body,
		credentials: "include",
	});
}

// update
function update(
	id: string,
	body: UpdateScholarshipOfferingPayload,
): Promise<ApiResponse<ScholarshipOffering>> {
	return $fetch(baseUrl + `/api/scholarship-offerings/${id}`, {
		method: "PUT",
		body,
		credentials: "include",
	});
}

// destroy
function destroy(id: string): Promise<ApiResponse<ScholarshipOffering>> {
	return $fetch(baseUrl + `/api/scholarship-offerings/${id}`, {
		method: "DELETE",
		credentials: "include",
	});
}

export const scholarshipOfferingService = {
	index,
	show,
	store,
	update,
	destroy,
};
