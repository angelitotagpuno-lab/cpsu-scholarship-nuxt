import type { ApiResponse } from "~/types/api-response";
import type { Application, CreateApplicationPayload } from "~/types/application";

const api = () => {
	const config = useRuntimeConfig();

	return {
		baseURL: config.public.baseUrl as string,
		credentials: "include" as const,
	};
};

// POST /api/v1/applications
function store(body: CreateApplicationPayload): Promise<Application> {
	return $fetch("/api/v1/applications", {
		...api(),
		method: "POST",
		body,
	});
}

// Legacy endpoint: verify before using
function myApplications(): Promise<ApiResponse<Application[]>> {
	return $fetch("/api/applications/me", {
		...api(),
		method: "GET",
	});
}

export const studentApplicationService = {
	store,
	myApplications,
};
