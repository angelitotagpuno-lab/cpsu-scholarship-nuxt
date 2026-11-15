import { defineStore } from "pinia";
import { ref } from "vue";
import type { FetchError } from "ofetch";
import { personnelService } from "~/services/personnel.service";
import type {
	Personnel,
	CreatePersonnel,
	UpdatePersonnel,
	PersonnelMeta,
	PersonnelQuery,
} from "~/types/personnel";

export const usePersonnelStore = defineStore("personnel", () => {
	const personnels = ref<Personnel[]>([]);
	const personnel = ref<Personnel | null>(null);
	const isLoading = ref(false);
	const errorMessage = ref<string | null>(null);

	const meta = ref<PersonnelMeta>({
		total: 0,
		page: 1,
		perPage: 20,
		totalPages: 0,
		hasNext: false,
		hasPrev: false,
	});

	const query = ref<PersonnelQuery>({
		page: 1,
		perPage: 20,
		search: "",
		sort: "createdAt",
		order: "desc",
	});

	function handleError(error: unknown, fallback: string) {
		const err = error as FetchError<{
			message?: string;
			error?: string;
		}>;

		errorMessage.value = err.data?.message || err.data?.error || err.message || fallback;

		console.error(fallback, error);
	}

	async function getPersonnels(params?: PersonnelQuery): Promise<boolean> {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			if (params) {
				query.value = { ...query.value, ...params };
			}

			const res = await personnelService.index(query.value);

			personnels.value = res.data;
			meta.value = res.meta;

			return true;
		} catch (error) {
			handleError(error, "Failed to fetch personnels");
			return false;
		} finally {
			isLoading.value = false;
		}
	}

	async function getPersonnel(id: string): Promise<boolean> {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			personnel.value = await personnelService.show(id);
			return true;
		} catch (error) {
			handleError(error, "Failed to fetch personnel");
			return false;
		} finally {
			isLoading.value = false;
		}
	}

	async function addPersonnel(body: CreatePersonnel): Promise<boolean> {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			personnel.value = await personnelService.store(body);
		} catch (error) {
			handleError(error, "Failed to add personnel");
			isLoading.value = false;
			return false;
		}

		isLoading.value = false;
		await getPersonnels();

		return !errorMessage.value;
	}

	async function editPersonnel(id: string, body: UpdatePersonnel): Promise<boolean> {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			personnel.value = await personnelService.update(id, body);
		} catch (error) {
			handleError(error, "Failed to update personnel");
			isLoading.value = false;
			return false;
		}

		isLoading.value = false;
		await getPersonnels();

		return !errorMessage.value;
	}

	async function deletePersonnel(id: string): Promise<boolean> {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			await personnelService.destroy(id);
		} catch (error) {
			handleError(error, "Failed to delete personnel");
			isLoading.value = false;
			return false;
		}

		isLoading.value = false;
		await getPersonnels();

		return !errorMessage.value;
	}

	return {
		personnels,
		personnel,
		meta,
		query,
		isLoading,
		errorMessage,
		getPersonnels,
		getPersonnel,
		addPersonnel,
		editPersonnel,
		deletePersonnel,
	};
});
