/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from "pinia";
import * as ScholarshipService from "~/services/scholarship.service";
import type { ScholarshipProgram } from "~/types/scholarship";

export const useScholarshipStore = defineStore("scholarship", () => {
	const items = ref<ScholarshipProgram[]>([]);
	const loading = ref(false);
	const error = ref("");

	async function fetchAll() {
		loading.value = true;
		error.value = "";

		try {
			items.value = await ScholarshipService.getAll();
		} catch (err: any) {
			error.value = err?.data?.message || "Unauthorized or failed to fetch";
		} finally {
			loading.value = false;
		}
	}

	async function create(payload: Partial<ScholarshipProgram>) {
		loading.value = true;
		error.value = "";

		try {
			const newItem = await ScholarshipService.create(payload);
			items.value.unshift(newItem);
		} catch (err: any) {
			error.value = err?.data?.message || "Create failed (check auth)";
		} finally {
			loading.value = false;
		}
	}

	async function update(id: string, payload: Partial<ScholarshipProgram>) {
		loading.value = true;
		error.value = "";

		try {
			const updated = await ScholarshipService.update(id, payload);
			const index = items.value.findIndex((i) => i.id === id);
			if (index !== -1) items.value[index] = updated;
		} catch (err: any) {
			error.value = err?.data?.message || "Update failed";
		} finally {
			loading.value = false;
		}
	}

	async function remove(id: string) {
		loading.value = true;
		error.value = "";

		try {
			await ScholarshipService.remove(id);
			items.value = items.value.filter((i) => i.id !== id);
		} catch (err: any) {
			error.value = err?.data?.message || "Delete failed";
		} finally {
			loading.value = false;
		}
	}

	return {
		items,
		loading,
		error,
		fetchAll,
		create,
		update,
		remove,
	};
});
