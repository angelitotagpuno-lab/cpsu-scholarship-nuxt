import type {
	StudentAllowlistQuery,
	StudentAllowlistResponse,
	StudentAllowlistImportResponse,
} from "~/types/student-allowlist";

const api = () => {
	const config = useRuntimeConfig();

	return {
		baseURL: config.public.baseUrl as string,
		credentials: "include" as const,
	};
};

// GET /api/v1/student-allowlists
function index(query: StudentAllowlistQuery = {}): Promise<StudentAllowlistResponse> {
	return $fetch("/api/v1/student-allowlists", {
		...api(),
		method: "GET",
		query,
	});
}

// POST /api/v1/student-allowlists/import
function importFile(file: File): Promise<StudentAllowlistImportResponse> {
	const formData = new FormData();
	formData.append("file", file);

	return $fetch("/api/v1/student-allowlists/import", {
		...api(),
		method: "POST",
		body: formData,
	});
}

export const studentAllowlistService = {
	index,
	importFile,
};
