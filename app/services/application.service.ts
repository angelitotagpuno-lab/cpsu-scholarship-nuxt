/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiResponse } from "~/types/api-response";

export type ApplicationStatus = "pending" | "under_review" | "approved" | "rejected";

const baseUrl = "/proxy";

/* =========================
   USER
========================= */
function store(form: FormData): Promise<ApiResponse<any>> {
	return $fetch(baseUrl + "/api/applications", {
		method: "POST",
		body: form,
		credentials: "include",
	});
}

function myApplications(): Promise<ApiResponse<any[]>> {
	return $fetch(baseUrl + "/api/applications/me", {
		credentials: "include",
	});
}

/* =========================
   ADMIN
========================= */
function index(params?: {
	page?: number;
	limit?: number;
	status?: string;
	offeringId?: string;
	q?: string;
}): Promise<ApiResponse<any[]>> {
	return $fetch(baseUrl + "/api/admin/applications", {
		method: "GET",
		query: params,
		credentials: "include",
	});
}

function show(id: string): Promise<ApiResponse<any>> {
	return $fetch(baseUrl + `/api/admin/applications/${id}`, {
		credentials: "include",
	});
}

function updateStatus(
	id: string,
	body: { status: "approved" | "rejected"; reason?: string },
): Promise<ApiResponse<any>> {
	return $fetch(baseUrl + `/api/admin/applications/${id}`, {
		method: "PATCH",
		body,
		credentials: "include",
	});
}

export const applicationService = {
	store,
	myApplications,
	index,
	show,
	updateStatus,
};
