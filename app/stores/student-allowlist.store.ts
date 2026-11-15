import { defineStore } from "pinia";
import { ref } from "vue";
import { studentAllowlistService } from "~/services/student-allowlist.service";

import type {
	StudentAllowlist,
	StudentAllowlistMeta,
	StudentAllowlistQuery,
	StudentAllowlistImportResponse,
} from "~/types/student-allowlist";

export const useStudentAllowlistStore = defineStore("student-allowlist", () => {
	const roster = ref<StudentAllowlist[]>([]);
	const meta = ref<StudentAllowlistMeta | null>(null);

	const isLoading = ref(false);
	const isImporting = ref(false);
	const errorMessage = ref<string | null>(null);
	const importResult = ref<StudentAllowlistImportResponse | null>(null);

	const query = ref<StudentAllowlistQuery>({
		page: 1,
		perPage: 20,
		sort: "createdAt",
		order: "desc",
	});

	function getErrorMessage(error: unknown): string {
		const e = error as {
			data?: { message?: string };
			response?: { _data?: { message?: string } };
			message?: string;
		};

		return (
			e.data?.message || e.response?._data?.message || e.message || "An unexpected error occurred."
		);
	}

	// GET ALL
	async function getRoster() {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			const res = await studentAllowlistService.index(query.value);

			roster.value = res.data;
			meta.value = res.meta;

			return true;
		} catch (error) {
			errorMessage.value = getErrorMessage(error);
			console.error("Failed to fetch roster:", error);
			return false;
		} finally {
			isLoading.value = false;
		}
	}

	// IMPORT CSV / EXCEL
	async function importRoster(file: File) {
		errorMessage.value = null;
		importResult.value = null;
		isImporting.value = true;

		try {
			const res = await studentAllowlistService.importFile(file);

			importResult.value = res;

			// Refresh the roster after successful import
			query.value.page = 1;
			await getRoster();

			return res;
		} catch (error) {
			errorMessage.value = getErrorMessage(error);
			console.error("Failed to import roster:", error);
			return null;
		} finally {
			isImporting.value = false;
		}
	}

	async function changePage(page: number) {
		query.value.page = page;
		await getRoster();
	}

	async function searchRoster(search: string) {
		query.value.search = search;
		query.value.page = 1;
		await getRoster();
	}

	return {
		roster,
		meta,
		query,
		isLoading,
		isImporting,
		errorMessage,
		importResult,
		getRoster,
		importRoster,
		changePage,
		searchRoster,
	};
});
