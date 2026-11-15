import { defineStore } from "pinia";
import { ref } from "vue";

import { fileService } from "~/services/file.service";

import type { UploadFileResult } from "~/types/file";

export const useFileStore = defineStore("file", () => {
	const isLoading = ref(false);
	const errorMessage = ref<string | null>(null);
	const uploadResults = ref<UploadFileResult[]>([]);

	function errorText(error: unknown): string {
		const e = error as {
			data?: { message?: string };
			response?: {
				_data?: { message?: string };
			};
			message?: string;
		};

		return e.data?.message || e.response?._data?.message || e.message || "File upload failed";
	}

	async function uploadFiles(files: File[]) {
		if (isLoading.value) return false;

		if (!files.length) {
			errorMessage.value = "Please select at least one file.";
			return false;
		}

		isLoading.value = true;
		errorMessage.value = null;
		uploadResults.value = [];

		try {
			for (const file of files) {
				try {
					const response = await fileService.upload(file);

					uploadResults.value.push({
						name: file.name,
						success: true,
						data: response,
					});
				} catch (error) {
					uploadResults.value.push({
						name: file.name,
						success: false,
						error: errorText(error),
					});
				}
			}

			const failed = uploadResults.value.filter((result) => !result.success);

			if (failed.length) {
				errorMessage.value = `${failed.length} file(s) failed to upload.`;
			}

			return failed.length === 0;
		} finally {
			isLoading.value = false;
		}
	}

	function reset() {
		errorMessage.value = null;
		uploadResults.value = [];
	}

	return {
		isLoading,
		errorMessage,
		uploadResults,
		uploadFiles,
		reset,
	};
});
