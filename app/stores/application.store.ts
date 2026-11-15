import { defineStore } from "pinia";
import { ref } from "vue";
import { applicationService } from "~/services/application.service";

import type { Application, ApplicationMeta, ApplicationQuery } from "~/types/application";

export const useAdminApplicationStore = defineStore("admin-application", () => {
	const items = ref<Application[]>([]);
	const item = ref<Application | null>(null);
	const meta = ref<ApplicationMeta | null>(null);

	const isLoading = ref(false);
	const isSaving = ref(false);
	const errorMessage = ref<string | null>(null);

	const query = ref<ApplicationQuery>({
		page: 1,
		perPage: 20,
		sort: "createdAt",
		order: "desc",
	});

	function errorText(error: unknown): string {
		const e = error as {
			status?: number;
			statusCode?: number;
			statusMessage?: string;
			data?: {
				message?: string;
				detail?: string;
				error?: string;
			};
			response?: {
				status?: number;
				_data?: {
					message?: string;
					detail?: string;
					error?: string;
				};
			};
			message?: string;
		};

		const data = e.data ?? e.response?._data;
		const status = e.status ?? e.statusCode ?? e.response?.status;

		console.error("Application API error:", {
			status,
			response: data,
			originalError: error,
		});

		const message =
			data?.message ||
			data?.detail ||
			data?.error ||
			e.statusMessage ||
			e.message ||
			"Request failed";

		if (status === 500) {
			return `Server error (500): ${message}. Check the backend Worker logs.`;
		}

		return message;
	}

	/* =========================
			 GET ALL APPLICATIONS
		========================= */
	async function fetchApplications() {
		isLoading.value = true;
		errorMessage.value = null;

		try {
			const res = await applicationService.index(query.value);

			items.value = res.data ?? [];
			meta.value = res.meta ?? null;

			return true;
		} catch (error) {
			errorMessage.value = errorText(error);
			items.value = [];
			meta.value = null;

			console.error("Fetch applications error:", error);

			return false;
		} finally {
			isLoading.value = false;
		}
	}

	/* =========================
			 GET ONE APPLICATION
		========================= */
	async function getApplication(id: string) {
		isLoading.value = true;
		errorMessage.value = null;
		item.value = null;

		try {
			const res = await applicationService.show(id);

			item.value = res;

			return item.value;
		} catch (error) {
			errorMessage.value = errorText(error);

			console.error("Get application error:", error);

			return null;
		} finally {
			isLoading.value = false;
		}
	}

	/* =========================
			 ACCEPT APPLICATION
		========================= */
	async function acceptApplication(id: string) {
		isSaving.value = true;
		errorMessage.value = null;

		try {
			await applicationService.accept(id);

			const refreshed = await fetchApplications();

			if (!refreshed) return false;

			return true;
		} catch (error) {
			errorMessage.value = errorText(error);

			console.error("Accept application error:", error);

			return false;
		} finally {
			isSaving.value = false;
		}
	}

	/* =========================
			 REJECT APPLICATION
		========================= */
	async function rejectApplication(id: string) {
		isSaving.value = true;
		errorMessage.value = null;

		try {
			await applicationService.reject(id);

			const refreshed = await fetchApplications();

			if (!refreshed) return false;

			return true;
		} catch (error) {
			errorMessage.value = errorText(error);

			console.error("Reject application error:", error);

			return false;
		} finally {
			isSaving.value = false;
		}
	}

	/* =========================
			 ACCEPT MULTIPLE
		========================= */
	async function acceptMultiple(ids: string[]) {
		if (!ids.length) {
			errorMessage.value = "No applications selected";
			return false;
		}

		isSaving.value = true;
		errorMessage.value = null;

		try {
			await applicationService.acceptMultiple(ids);

			const refreshed = await fetchApplications();

			if (!refreshed) return false;

			return true;
		} catch (error) {
			errorMessage.value = errorText(error);

			console.error("Bulk accept error:", error);

			return false;
		} finally {
			isSaving.value = false;
		}
	}

	/* =========================
			 DELETE APPLICATION
		========================= */
	async function deleteApplication(id: string) {
		isSaving.value = true;
		errorMessage.value = null;

		try {
			await applicationService.destroy(id);

			const refreshed = await fetchApplications();

			if (!refreshed) return false;

			return true;
		} catch (error) {
			errorMessage.value = errorText(error);

			console.error("Delete application error:", error);

			return false;
		} finally {
			isSaving.value = false;
		}
	}

	return {
		items,
		item,
		meta,
		query,
		isLoading,
		isSaving,
		errorMessage,

		fetchApplications,
		getApplication,
		acceptApplication,
		rejectApplication,
		acceptMultiple,
		deleteApplication,
	};
});
