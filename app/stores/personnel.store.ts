import camelize from "camelize";
import { personnelService } from "~/services/personnel.service";
import type { Personnel } from "~/types/personnel";

export const usePersonnelStore = defineStore("personnel", () => {
	const personnels = ref<Personnel[]>([]);
	const personnel = ref<Personnel | null>(null);
	const isLoading = ref(false);
	const errorMessage = ref<string | null>(null);

	async function getPersonnels() {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			const res = await personnelService.index();

			// ✅ FIX: normalize list
			personnels.value = camelize(res.data);
		} catch (e) {
			errorMessage.value = "Failed to fetch personnels";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	async function getPersonnel(id: string) {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			const res = await personnelService.show(id);

			// already correct
			personnel.value = camelize(res.data);
		} catch (e) {
			errorMessage.value = "Failed to fetch personnel";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	async function addPersonnel(body: any) {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			const res = await personnelService.store(body);
			personnel.value = camelize(res.data);

			await getPersonnels();
		} catch (e) {
			errorMessage.value = "Failed to add personnel";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	async function editPersonnel(id: string, body: any) {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			const res = await personnelService.update(id, body);
			personnel.value = camelize(res.data);

			await getPersonnels();
		} catch (e) {
			errorMessage.value = "Failed to update personnel";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	async function deletePersonnel(id: string) {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			await personnelService.destroy(id);
			await getPersonnels();
		} catch (e) {
			errorMessage.value = "Failed to delete personnel";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	return {
		personnels,
		personnel,
		isLoading,
		errorMessage,
		getPersonnels,
		getPersonnel,
		addPersonnel,
		editPersonnel,
		deletePersonnel,
	};
});
