<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { usePayoutStore } from "~/stores/payout.store";
import type { Payout } from "~/types/payout";

const props = defineProps<{
	payouts: Payout[];
}>();

const emit = defineEmits<{
	updated: [];
}>();

const payoutStore = usePayoutStore();
const toast = useToast();

const selectedIds = ref<string[]>([]);
const showConfirmModal = ref(false);

const pendingPayouts = computed(() =>
	props.payouts.filter((p) => p.status === "pending" && !p.isClaimable),
);

const allSelected = computed(
	() =>
		pendingPayouts.value.length > 0 &&
		pendingPayouts.value.every((p) => selectedIds.value.includes(p.id)),
);

watch(
	pendingPayouts,
	(records) => {
		const validIds = new Set(records.map((p) => p.id));

		selectedIds.value = selectedIds.value.filter((id) => validIds.has(id));
	},
	{ immediate: true },
);

function toggleAll(value: boolean | "indeterminate") {
	selectedIds.value = value === true ? pendingPayouts.value.map((p) => p.id) : [];
}

function togglePayout(id: string, checked: boolean | "indeterminate") {
	if (checked === true) {
		if (!selectedIds.value.includes(id)) {
			selectedIds.value = [...selectedIds.value, id];
		}
	} else {
		selectedIds.value = selectedIds.value.filter((selectedId) => selectedId !== id);
	}
}

async function markAsClaimable() {
	if (!selectedIds.value.length) return;

	const result = await payoutStore.openClaimablePayouts({
		ids: selectedIds.value,
	});

	if (result !== null) {
		toast.add({
			title: "Payouts Updated",
			description: "Selected payouts are now open for claiming.",
			color: "success",
		});

		selectedIds.value = [];
		showConfirmModal.value = false;

		emit("updated");
	} else {
		toast.add({
			title: "Update Failed",
			description: payoutStore.errorMessage || "Unable to mark payouts as claimable.",
			color: "error",
		});
	}
}

function formatAmount(amount: string) {
	return Number(amount).toLocaleString("en-PH", {
		style: "currency",
		currency: "PHP",
	});
}
</script>

<template>
	<div class="space-y-4">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div>
				<h2 class="font-semibold text-slate-900 dark:text-white">Pending Payouts</h2>

				<p class="text-sm text-slate-500">Select payouts to open for student claiming.</p>
			</div>

			<UButton
				icon="i-lucide-check-check"
				color="primary"
				:disabled="selectedIds.length === 0"
				@click="showConfirmModal = true"
			>
				Mark as Claimable ({{ selectedIds.length }})
			</UButton>
		</div>

		<div class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
			<table class="w-full min-w-[600px] text-sm">
				<thead class="bg-slate-100 dark:bg-slate-800">
					<tr>
						<th class="px-4 py-3 text-left">
							<UCheckbox
								:model-value="allSelected"
								:disabled="!pendingPayouts.length"
								@update:model-value="toggleAll"
							/>
						</th>

						<th class="px-4 py-3 text-left">Application ID</th>

						<th class="px-4 py-3 text-left">Semester</th>

						<th class="px-4 py-3 text-right">Amount</th>

						<th class="px-4 py-3 text-center">Status</th>
					</tr>
				</thead>

				<tbody>
					<tr
						v-for="payout in pendingPayouts"
						:key="payout.id"
						class="border-t border-slate-200 dark:border-slate-800"
					>
						<td class="px-4 py-3">
							<UCheckbox
								:model-value="selectedIds.includes(payout.id)"
								@update:model-value="(value) => togglePayout(payout.id, value)"
							/>
						</td>

						<td class="px-4 py-3">
							{{ payout.applicationId }}
						</td>

						<td class="px-4 py-3">
							{{ payout.semester }}
						</td>

						<td class="px-4 py-3 text-right">
							{{ formatAmount(payout.amount) }}
						</td>

						<td class="px-4 py-3 text-center">
							<UBadge
								color="warning"
								variant="soft"
							>
								Pending
							</UBadge>
						</td>
					</tr>

					<tr v-if="pendingPayouts.length === 0">
						<td
							colspan="5"
							class="px-4 py-10 text-center text-slate-500"
						>
							No pending payouts available for claiming.
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<UModal
			v-model:open="showConfirmModal"
			title="Confirm Claimable Payouts"
			description="This will open the selected payouts for student claiming."
		>
			<template #body>
				<p class="text-sm text-slate-600 dark:text-slate-300">
					Are you sure you want to mark
					<strong>{{ selectedIds.length }}</strong>
					payout(s) as claimable?
				</p>
			</template>

			<template #footer>
				<div class="flex w-full justify-end gap-2">
					<UButton
						color="neutral"
						variant="outline"
						:disabled="payoutStore.isSaving"
						@click="showConfirmModal = false"
					>
						Cancel
					</UButton>

					<UButton
						color="primary"
						:loading="payoutStore.isSaving"
						@click="markAsClaimable"
					>
						Confirm
					</UButton>
				</div>
			</template>
		</UModal>
	</div>
</template>
