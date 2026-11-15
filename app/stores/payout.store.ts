import { defineStore } from "pinia";
import { ref, computed } from "vue";

import { payoutService } from "~/services/payout.service";

import type { Payout, ClaimablePayoutPayload, ReleasePayoutPayload } from "~/types/payout";

export const usePayoutStore = defineStore("payout", () => {
	const items = ref<Payout[]>([]);
	const item = ref<Payout | null>(null);

	const isLoading = ref(false);
	const isSaving = ref(false);
	const errorMessage = ref<string | null>(null);

	function errorText(error: unknown): string {
		const e = error as {
			data?: { message?: string };
			response?: {
				_data?: { message?: string };
			};
			message?: string;
		};

		return e.data?.message || e.response?._data?.message || e.message || "Request failed";
	}

	// GET student payouts
	async function fetchMyPayouts() {
		isLoading.value = true;
		errorMessage.value = null;

		try {
			const res = await payoutService.me();

			items.value = res.data;

			return res.data;
		} catch (error) {
			errorMessage.value = errorText(error);
			items.value = [];
			return null;
		} finally {
			isLoading.value = false;
		}
	}

	// GET payout by ID (admin/personnel)
	async function fetchPayout(id: string) {
		isLoading.value = true;
		errorMessage.value = null;

		try {
			const res = await payoutService.show(id);

			item.value = res;

			return res;
		} catch (error) {
			errorMessage.value = errorText(error);
			item.value = null;
			return null;
		} finally {
			isLoading.value = false;
		}
	}

	// POST open selected payouts
	async function openClaimablePayouts(payload: ClaimablePayoutPayload) {
		isSaving.value = true;
		errorMessage.value = null;

		try {
			const res = await payoutService.claimable(payload);

			const updated = res.data;

			for (const payout of updated) {
				const index = items.value.findIndex((p) => p.id === payout.id);

				if (index !== -1) {
					items.value[index] = payout;
				}
			}

			return updated;
		} catch (error) {
			errorMessage.value = errorText(error);
			return null;
		} finally {
			isSaving.value = false;
		}
	}

	// POST release payout with check proof
	async function releasePayout(id: string, payload: ReleasePayoutPayload) {
		isSaving.value = true;
		errorMessage.value = null;

		try {
			const res = await payoutService.release(id, payload);

			const index = items.value.findIndex((p) => p.id === id);

			if (index !== -1) {
				items.value[index] = res;
			}

			item.value = res;

			return res;
		} catch (error) {
			errorMessage.value = errorText(error);
			return null;
		} finally {
			isSaving.value = false;
		}
	}

	// Computed values
	const totalPayouts = computed(() => items.value.length);

	const pendingPayouts = computed(() => items.value.filter((p) => p.status === "pending"));

	const claimablePayouts = computed(() => items.value.filter((p) => p.isClaimable));

	const totalAmount = computed(() => items.value.reduce((sum, p) => sum + Number(p.amount), 0));

	return {
		items,
		item,
		isLoading,
		isSaving,
		errorMessage,

		totalPayouts,
		pendingPayouts,
		claimablePayouts,
		totalAmount,

		fetchMyPayouts,
		fetchPayout,
		openClaimablePayouts,
		releasePayout,
	};
});
