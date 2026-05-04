import { defineStore } from "pinia";
import { scholarshipService } from "~/services/scholarship.service";
import type {
	ScholarshipProgram,
	CreateScholarshipProgramPayload,
	UpdateScholarshipProgramPayload,
} from "~/types/scholarship";

export const useScholarshipStore = defineStore("scholarship", () => {
	const items = ref<ScholarshipProgram[]>([]);
	const item = ref<ScholarshipProgram | null>(null);

	const loading = ref(false);
	const error = ref<string | null>(null);

	const activeItems = computed(() => items.value.filter((i) => i.is_active));

	const inactiveItems = computed(() => items.value.filter((i) => !i.is_active));

	async function fetchAll() {
		loading.value = true;
		error.value = null;

		try {
			const res = await scholarshipService.index();
			items.value = res.data;
		} catch (e) {
			error.value = "Failed to fetch scholarship programs";
			console.error(e);
		} finally {
			loading.value = false;
		}
	}

	async function fetchOne(id: string) {
		loading.value = true;
		error.value = null;

		try {
			const res = await scholarshipService.show(id);
			item.value = res.data;
		} catch (e) {
			error.value = "Failed to fetch scholarship program";
			console.error(e);
		} finally {
			loading.value = false;
		}
	}

	async function create(body: CreateScholarshipProgramPayload) {
		loading.value = true;
		error.value = null;

		try {
			const res = await scholarshipService.store(body);
			item.value = res.data;
			await fetchAll();
		} catch (e) {
			error.value = "Failed to create scholarship program";
			console.error(e);
		} finally {
			loading.value = false;
		}
	}

	async function updateItem(id: string, body: UpdateScholarshipProgramPayload) {
		loading.value = true;
		error.value = null;

		try {
			const res = await scholarshipService.update(id, body);
			item.value = res.data;
			await fetchAll();
		} catch (e) {
			error.value = "Failed to update scholarship program";
			console.error(e);
		} finally {
			loading.value = false;
		}
	}

	async function remove(id: string) {
		loading.value = true;
		error.value = null;

		try {
			await scholarshipService.destroy(id);
			await fetchAll();
		} catch (e) {
			error.value = "Failed to delete scholarship program";
			console.error(e);
		} finally {
			loading.value = false;
		}
	}

	return {
		items,
		item,
		loading,
		error,
		activeItems,
		inactiveItems,

		fetchAll,
		fetchOne,
		create,
		updateItem,
		remove,
	};
});
