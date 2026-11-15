import type { ApiResponse } from "~/types/api-response";
import type { Application, ApplicationListResponse, ApplicationQuery } from "~/types/application";

const api = () => {
	const config = useRuntimeConfig();

	return {
		baseURL: config.public.baseUrl as string,
		credentials: "include" as const,
	};
};

/* =========================
	 USER APPLICATIONS
	 Existing functionality
========================= */

function store(form: FormData): Promise<ApiResponse<Application>> {
	return $fetch("/api/applications", {
		...api(),
		method: "POST",
		body: form,
	});
}

// Existing student application list.
// Endpoint must be verified against new API.
function myApplications(): Promise<ApiResponse<Application[]>> {
	return $fetch("/api/applications/me", {
		...api(),
		method: "GET",
	});
}

/* =========================
	 ADMIN APPLICATIONS
========================= */

// GET ALL APPLICATIONS
function index(params: ApplicationQuery = {}): Promise<ApplicationListResponse> {
	return $fetch("/api/v1/applications", {
		...api(),
		method: "GET",
		query: params,
	});
}

// GET APPLICATION BY ID
function show(id: string): Promise<Application> {
	return $fetch(`/api/v1/applications/${id}`, {
		...api(),
		method: "GET",
	});
}

// ACCEPT APPLICATION
function accept(id: string): Promise<unknown> {
	return $fetch(`/api/v1/applications/${id}/accept`, {
		...api(),
		method: "POST",
	});
}

// REJECT APPLICATION
function reject(id: string): Promise<unknown> {
	return $fetch(`/api/v1/applications/${id}/reject`, {
		...api(),
		method: "POST",
	});
}

// ACCEPT MULTIPLE APPLICATIONS
function acceptMultiple(ids: string[]): Promise<unknown> {
	return $fetch("/api/v1/applications/accept", {
		...api(),
		method: "POST",
		body: {
			ids,
		},
	});
}

// DELETE APPLICATION
function destroy(id: string): Promise<unknown> {
	return $fetch(`/api/v1/applications/${id}`, {
		...api(),
		method: "DELETE",
	});
}

/* =========================
	 COMPATIBILITY METHOD
========================= */

// Supports existing code that calls
// updateStatus(id, { status, reason }).
// The new API has no general PATCH endpoint.
function updateStatus(
	id: string,
	body: {
		status: "approved" | "rejected";
		reason?: string;
	},
): Promise<unknown> {
	if (body.status === "approved") {
		return accept(id);
	}

	return reject(id);
}

export const applicationService = {
	store,
	myApplications,
	index,
	show,
	accept,
	reject,
	acceptMultiple,
	destroy,
	updateStatus,
};
