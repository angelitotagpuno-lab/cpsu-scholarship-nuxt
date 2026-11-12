/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineStore } from "pinia";
import { scholarshipOfferingService } from "~/services/scholarship-offering.service";
import type {
	ScholarshipOffering,
	CreateScholarshipOfferingPayload,
	UpdateScholarshipOfferingPayload,
} from "~/types/scholarship-offering";

export const useScholarshipOfferingStore = defineStore("scholarship-offering", () => {
	const offerings = ref<ScholarshipOffering[]>([]);
	const offering = ref<ScholarshipOffering | null>(null);

	const isLoading = ref(false);
	const errorMessage = ref<string | null>(null);
	async function getOfferings() {
		isLoading.value = true;
		errorMessage.value = null;

		try {
			const res = await scholarshipOfferingService.index();

			// 🔍 DEBUG START
			console.log("📦 RAW API RESPONSE (offerings):", res);
			console.log("📦 res.data:", (res as any).data);
			console.log("📦 res.data.data:", (res as any).data?.data);
			// 🔍 DEBUG END

			// ✅ FIX: handle different API shapes safely
			offerings.value = (res as any).data?.data ?? (res as any).data ?? [];

			console.log("✅ FINAL ASSIGNED OFFERINGS:", offerings.value);
		} catch (e) {
			console.error("❌ ERROR fetching offerings:", e);
			errorMessage.value = "Failed to fetch offerings";
		} finally {
			isLoading.value = false;
		}
	}

	async function getOffering(id: string) {
		isLoading.value = true;

		try {
			const res = await scholarshipOfferingService.show(id);
			offering.value = res.data;
		} catch (e) {
			errorMessage.value = "Failed to fetch offering";
		} finally {
			isLoading.value = false;
		}
	}

	async function addOffering(body: CreateScholarshipOfferingPayload) {
		isLoading.value = true;

		try {
			const res = await scholarshipOfferingService.store(body);
			offering.value = res.data;
			await getOfferings();
		} catch (e) {
			errorMessage.value = "Failed to create offering";
		} finally {
			isLoading.value = false;
		}
	}

	async function editOffering(id: string, body: UpdateScholarshipOfferingPayload) {
		isLoading.value = true;

		try {
			const res = await scholarshipOfferingService.update(id, body);
			offering.value = res.data;
			await getOfferings();
		} catch (e) {
			errorMessage.value = "Failed to update offering";
		} finally {
			isLoading.value = false;
		}
	}

	async function deleteOffering(id: string) {
		isLoading.value = true;

		try {
			await scholarshipOfferingService.destroy(id);
			await getOfferings();
		} catch (e) {
			errorMessage.value = "Failed to delete offering";
		} finally {
			isLoading.value = false;
		}
	}

	return {
		offerings,
		offering,
		isLoading,
		errorMessage,

		getOfferings,
		getOffering,
		addOffering,
		editOffering,
		deleteOffering,
	};
});
