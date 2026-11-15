import { defineStore } from "pinia";
import { ref } from "vue";
import { scholarshipOfferingService } from "~/services/scholarship-offering.service";

import type {
	ScholarshipOffering,
	CreateScholarshipOfferingPayload,
	UpdateScholarshipOfferingPayload,
	ScholarshipOfferingQuery,
	ScholarshipOfferingMeta,
} from "~/types/scholarship-offering";

export const useScholarshipOfferingStore = defineStore("scholarship-offering", () => {
	const offerings = ref<ScholarshipOffering[]>([]);
	const offering = ref<ScholarshipOffering | null>(null);

	const isLoading = ref(false);
	const errorMessage = ref<string | null>(null);
	const meta = ref<ScholarshipOfferingMeta | null>(null);

	function handleError(e: unknown, fallback: string) {
		console.error(fallback, e);

		const err = e as {
			data?: {
				message?: string;
				error?: string;
			};
			message?: string;
		};

		errorMessage.value = err.data?.message || err.data?.error || err.message || fallback;
	}

	async function getOfferings(query: ScholarshipOfferingQuery = {}): Promise<boolean> {
		isLoading.value = true;
		errorMessage.value = null;

		try {
			const res = await scholarshipOfferingService.index(query);

			offerings.value = res.data;
			meta.value = res.meta;

			return true;
		} catch (e) {
			handleError(e, "Failed to fetch offerings");
			return false;
		} finally {
			isLoading.value = false;
		}
	}

	async function getOffering(id: string): Promise<ScholarshipOffering | null> {
		isLoading.value = true;
		errorMessage.value = null;

		try {
			const res = await scholarshipOfferingService.show(id);

			offering.value = res;
			return res;
		} catch (e) {
			handleError(e, "Failed to fetch offering");
			return null;
		} finally {
			isLoading.value = false;
		}
	}

	async function addOffering(body: CreateScholarshipOfferingPayload): Promise<boolean> {
		isLoading.value = true;
		errorMessage.value = null;

		try {
			const res = await scholarshipOfferingService.store(body);

			offering.value = res;
			offerings.value.unshift(res);

			return true;
		} catch (e) {
			handleError(e, "Failed to create offering");
			return false;
		} finally {
			isLoading.value = false;
		}
	}

	async function editOffering(
		id: string,
		body: UpdateScholarshipOfferingPayload,
	): Promise<boolean> {
		isLoading.value = true;
		errorMessage.value = null;

		try {
			const res = await scholarshipOfferingService.update(id, body);

			offering.value = res;

			const index = offerings.value.findIndex((o) => o.id === id);

			if (index !== -1) {
				offerings.value[index] = res;
			}

			return true;
		} catch (e) {
			handleError(e, "Failed to update offering");
			return false;
		} finally {
			isLoading.value = false;
		}
	}

	async function deleteOffering(id: string): Promise<boolean> {
		isLoading.value = true;
		errorMessage.value = null;

		try {
			await scholarshipOfferingService.destroy(id);

			offerings.value = offerings.value.filter((o) => o.id !== id);

			if (offering.value?.id === id) {
				offering.value = null;
			}

			return true;
		} catch (e) {
			handleError(e, "Failed to delete offering");
			return false;
		} finally {
			isLoading.value = false;
		}
	}

	return {
		offerings,
		offering,
		isLoading,
		errorMessage,
		meta,
		getOfferings,
		getOffering,
		addOffering,
		editOffering,
		deleteOffering,
	};
});
