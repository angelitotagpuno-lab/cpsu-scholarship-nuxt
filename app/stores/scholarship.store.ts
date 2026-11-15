import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { scholarshipService } from "~/services/scholarship.service";

import type {
	ScholarshipProgram,
	CreateScholarshipProgramPayload,
	UpdateScholarshipProgramPayload,
	ScholarshipProgramQuery,
	ScholarshipProgramMeta,
} from "~/types/scholarship";

export const useScholarshipStore = defineStore("scholarship", () => {
	const items = ref<ScholarshipProgram[]>([]);
	const item = ref<ScholarshipProgram | null>(null);

	const loading = ref(false);
	const error = ref<string | null>(null);
	const meta = ref<ScholarshipProgramMeta | null>(null);

	const activeItems = computed(() => items.value.filter((i) => !i.isArchived));

	const inactiveItems = computed(() => items.value.filter((i) => i.isArchived));

	function handleError(e: unknown, fallback: string) {
		console.error(fallback, e);

		const err = e as {
			data?: { message?: string; error?: string };
			message?: string;
		};

		error.value = err.data?.message || err.data?.error || err.message || fallback;
	}

	async function fetchAll(query: ScholarshipProgramQuery = {}) {
		loading.value = true;
		error.value = null;

		try {
			const res = await scholarshipService.index(query);

			items.value = res.data;
			meta.value = res.meta;

			return true;
		} catch (e) {
			handleError(e, "Failed to fetch scholarship programs");
			return false;
		} finally {
			loading.value = false;
		}
	}

	async function fetchOne(id: string) {
		loading.value = true;
		error.value = null;

		try {
			const res = await scholarshipService.show(id);

			item.value = res;
			return res;
		} catch (e) {
			handleError(e, "Failed to fetch scholarship program");
			return null;
		} finally {
			loading.value = false;
		}
	}

	async function create(body: CreateScholarshipProgramPayload) {
		loading.value = true;
		error.value = null;

		try {
			const res = await scholarshipService.store(body);

			item.value = res;

			await fetchAll();

			return !error.value;
		} catch (e) {
			handleError(e, "Failed to create scholarship program");
			return false;
		} finally {
			loading.value = false;
		}
	}

	async function updateItem(id: string, body: UpdateScholarshipProgramPayload) {
		loading.value = true;
		error.value = null;

		try {
			const res = await scholarshipService.update(id, body);

			item.value = res;

			await fetchAll();

			return !error.value;
		} catch (e) {
			handleError(e, "Failed to update scholarship program");
			return false;
		} finally {
			loading.value = false;
		}
	}

	async function remove(id: string) {
		loading.value = true;
		error.value = null;

		try {
			await scholarshipService.destroy(id);

			if (item.value?.id === id) {
				item.value = null;
			}

			await fetchAll();

			return !error.value;
		} catch (e) {
			handleError(e, "Failed to delete scholarship program");
			return false;
		} finally {
			loading.value = false;
		}
	}

	return {
		items,
		item,
		loading,
		error,
		meta,

		activeItems,
		inactiveItems,

		fetchAll,
		fetchOne,
		create,
		updateItem,
		remove,
	};
});
