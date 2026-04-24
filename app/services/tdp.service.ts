import type { ApiResponse } from "~/types/api-response";
import type { TdpApplicant } from "~/types/tdp";

const baseUrl = "/proxy";

// GET ALL
function index(): Promise<ApiResponse<TdpApplicant[]>> {
	return $fetch(baseUrl + "/api/tdp", {
		method: "GET",
		credentials: "include",
	});
}

// GET ONE
function show(id: string): Promise<ApiResponse<TdpApplicant>> {
	return $fetch(baseUrl + `/api/tdp/${id}`, {
		credentials: "include",
	});
}

// CREATE
function store(body: TdpApplicant): Promise<ApiResponse<TdpApplicant>> {
	return $fetch(baseUrl + "/api/tdp", {
		method: "POST",
		body: body,
		credentials: "include",
	});
}

// UPDATE
function update(id: string, body: TdpApplicant): Promise<ApiResponse<TdpApplicant>> {
	return $fetch(baseUrl + `/api/tdp/${id}`, {
		method: "PUT",
		body: body,
		credentials: "include",
	});
}

// DELETE
function destroy(id: string): Promise<ApiResponse<TdpApplicant>> {
	return $fetch(baseUrl + `/api/tdp/${id}`, {
		method: "DELETE",
		credentials: "include",
	});
}

export const tdpService = {
	index,
	show,
	store,
	update,
	destroy,
};
