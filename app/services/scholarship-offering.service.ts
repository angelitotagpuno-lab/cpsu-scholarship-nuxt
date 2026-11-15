import type {
	ScholarshipOffering,
	CreateScholarshipOfferingPayload,
	UpdateScholarshipOfferingPayload,
	ScholarshipOfferingQuery,
	ScholarshipOfferingListResponse,
	ScholarshipOfferingCursorQuery,
	ScholarshipOfferingCursorResponse,
} from "~/types/scholarship-offering";

const api = () => {
	const config = useRuntimeConfig();

	return {
		baseURL: config.public.baseUrl,
		credentials: "include" as const,
	};
};

function index(query: ScholarshipOfferingQuery = {}): Promise<ScholarshipOfferingListResponse> {
	return $fetch("/api/v1/program-offerings", {
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

function indexCursor(
	query: ScholarshipOfferingCursorQuery = {},
): Promise<ScholarshipOfferingCursorResponse> {
	return $fetch("/api/v1/program-offerings/cursor", {
		...api(),
		method: "GET",
		query: {
			...(query.cursor ? { cursor: query.cursor } : {}),
			perPage: query.perPage ?? 20,
			direction: query.direction ?? "next",
		},
	});
}

function show(id: string): Promise<ScholarshipOffering> {
	return $fetch(`/api/v1/program-offerings/${encodeURIComponent(id)}`, {
		...api(),
		method: "GET",
	});
}

function store(body: CreateScholarshipOfferingPayload): Promise<ScholarshipOffering> {
	return $fetch("/api/v1/program-offerings", {
		...api(),
		method: "POST",
		body,
	});
}

function update(id: string, body: UpdateScholarshipOfferingPayload): Promise<ScholarshipOffering> {
	return $fetch(`/api/v1/program-offerings/${encodeURIComponent(id)}`, {
		...api(),
		method: "PUT",
		body,
	});
}

function destroy(id: string): Promise<void> {
	return $fetch(`/api/v1/program-offerings/${encodeURIComponent(id)}`, {
		...api(),
		method: "DELETE",
	});
}

export const scholarshipOfferingService = {
	index,
	indexCursor,
	show,
	store,
	update,
	destroy,
};
