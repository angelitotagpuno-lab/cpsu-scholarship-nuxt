/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineStore } from "pinia";
import { ref } from "vue";
import { applicationService } from "~/services/application.service";

export const useApplicationStore = defineStore("application", () => {
	const items = ref<any[]>([]);
	const item = ref<any | null>(null);
	const isLoading = ref(false);
	const errorMessage = ref<string | null>(null);

	/* =========================
	   USER SUBMIT
	========================= */
	async function submitApplication(form: FormData) {
		isLoading.value = true;
		try {
			const res = await applicationService.store(form);
			return res;
		} catch (e) {
			errorMessage.value = "Failed to submit application";
			throw e;
		} finally {
			isLoading.value = false;
		}
	}

	/* =========================
	   ADMIN LIST
	========================= */
	async function fetchApplications(params?: any) {
		isLoading.value = true;
		try {
			const res = await applicationService.index(params);
			items.value = res.data ?? [];
		} catch (e) {
			errorMessage.value = "Failed to fetch applications";
		} finally {
			isLoading.value = false;
		}
	}

	async function getApplication(id: string) {
		isLoading.value = true;
		try {
			const res = await applicationService.show(id);
			item.value = res.data;
		} catch (e) {
			errorMessage.value = "Failed to fetch application";
		} finally {
			isLoading.value = false;
		}
	}

	async function updateStatus(id: string, body: any) {
		isLoading.value = true;
		try {
			await applicationService.updateStatus(id, body);
			await fetchApplications();
		} catch (e) {
			errorMessage.value = "Failed to update application";
		} finally {
			isLoading.value = false;
		}
	}

	return {
		items,
		item,
		isLoading,
		errorMessage,
		submitApplication,
		fetchApplications,
		getApplication,
		updateStatus,
	};
});
