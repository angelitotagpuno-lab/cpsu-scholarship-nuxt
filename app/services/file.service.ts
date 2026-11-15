import type { UploadFileResponse } from "~/types/file";

const api = () => {
	const config = useRuntimeConfig();

	return {
		baseURL: config.public.baseUrl as string,
		credentials: "include" as const,
	};
};

// POST /api/v1/files/upload
function upload(file: File): Promise<UploadFileResponse> {
	const formData = new FormData();

	formData.append("file", file);

	return $fetch("/api/v1/files/upload", {
		...api(),
		method: "POST",
		body: formData,
	});
}

export const fileService = {
	upload,
};
