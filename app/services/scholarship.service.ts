import type {
	ScholarshipProgram,
	CreateScholarshipProgramPayload,
	UpdateScholarshipProgramPayload,
	ScholarshipProgramListResponse,
	ScholarshipProgramQuery,
} from "~/types/scholarship";

const api = () => {
	const config = useRuntimeConfig();

	return {
		baseURL: config.public.baseUrl,
		credentials: "include" as const,
	};
};

function index(query: ScholarshipProgramQuery = {}): Promise<ScholarshipProgramListResponse> {
	return $fetch("/api/v1/scholarship-programs", {
		...api(),
		method: "GET",
		query: {
			page: query.page ?? 1,
			perPage: query.perPage ?? 100,
			...(query.search ? { search: query.search } : {}),
			sort: query.sort ?? "createdAt",
			order: query.order ?? "desc",
		},
	});
}

function show(id: string): Promise<ScholarshipProgram> {
	return $fetch(`/api/v1/scholarship-programs/${encodeURIComponent(id)}`, {
		...api(),
		method: "GET",
	});
}

function store(body: CreateScholarshipProgramPayload): Promise<ScholarshipProgram> {
	return $fetch("/api/v1/scholarship-programs", {
		...api(),
		method: "POST",
		body,
	});
}

function update(id: string, body: UpdateScholarshipProgramPayload): Promise<ScholarshipProgram> {
	return $fetch(`/api/v1/scholarship-programs/${encodeURIComponent(id)}`, {
		...api(),
		method: "PUT",
		body,
	});
}

function destroy(id: string): Promise<void> {
	return $fetch(`/api/v1/scholarship-programs/${encodeURIComponent(id)}`, {
		...api(),
		method: "DELETE",
	});
}

export const scholarshipService = {
	index,
	show,
	store,
	update,
	destroy,
};
