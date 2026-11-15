<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { usePayoutStore } from "~/stores/payout.store";

type Program = "TES" | "TDP";

const props = withDefaults(
	defineProps<{
		program: Program;
		verifiedApplicationPrograms?: Record<string, Program>;
	}>(),
	{
		verifiedApplicationPrograms: () => ({}),
	},
);

const toast = useToast();
const store = usePayoutStore();

const { items, isLoading, isSaving, errorMessage } = storeToRefs(store);

const selectedId = ref("");
const checkNo = ref("");
const file = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const preview = ref<string | null>(null);
const showConfirm = ref(false);
const loadFailed = ref(false);

const verifiedPayouts = computed(() =>
	items.value.filter(
		(payout) => props.verifiedApplicationPrograms[payout.applicationId] === props.program,
	),
);

const unverifiedCount = computed(
	() =>
		items.value.filter((payout) => !props.verifiedApplicationPrograms[payout.applicationId]).length,
);

const selectedPayout = computed(() => verifiedPayouts.value.find((p) => p.id === selectedId.value));

const claimablePayouts = computed(() =>
	verifiedPayouts.value.filter((p) => p.isClaimable && p.status.toLowerCase() === "pending"),
);

const totalAmount = computed(() =>
	verifiedPayouts.value.reduce((sum, p) => sum + Number(p.amount || 0), 0),
);

const canSubmit = computed(
	() =>
		!!selectedPayout.value &&
		selectedPayout.value.isClaimable &&
		selectedPayout.value.status.toLowerCase() === "pending" &&
		!!checkNo.value.trim() &&
		checkNo.value.trim().length <= 100 &&
		!isSaving.value,
);

function formatAmount(amount: string | number) {
	return new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
	}).format(Number(amount));
}

function formatDate(value: string | null) {
	if (!value) return "Not available";

	const date = new Date(value);

	return Number.isNaN(date.getTime())
		? "Not available"
		: date.toLocaleDateString("en-PH", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
}

function clearPreview() {
	if (preview.value) {
		URL.revokeObjectURL(preview.value);
		preview.value = null;
	}
}

function resetForm() {
	selectedId.value = "";
	checkNo.value = "";
	file.value = null;
	showConfirm.value = false;
	clearPreview();

	if (fileInput.value) {
		fileInput.value.value = "";
	}
}

function selectPayout(id: string) {
	const payout = claimablePayouts.value.find((p) => p.id === id);

	if (!payout) return;

	resetForm();
	selectedId.value = payout.id;
	checkNo.value = payout.checkNo ?? "";
}

function openFile() {
	fileInput.value?.click();
}

function handleFile(event: Event) {
	const input = event.target as HTMLInputElement;
	const selected = input.files?.[0];

	if (!selected) return;

	if (!["image/jpeg", "image/png"].includes(selected.type)) {
		toast.add({
			title: "Invalid File",
			description: "Please select a JPEG or PNG image.",
			color: "error",
		});

		input.value = "";
		return;
	}

	clearPreview();
	file.value = selected;
	preview.value = URL.createObjectURL(selected);
}

async function loadPayouts() {
	resetForm();
	loadFailed.value = false;

	const result = await store.fetchMyPayouts();

	if (result === null) {
		loadFailed.value = true;
	}
}

function confirmSubmission() {
	if (!canSubmit.value) return;
	showConfirm.value = true;
}

async function submitPayout() {
	if (!canSubmit.value || !selectedPayout.value) return;

	const id = selectedPayout.value.id;
	showConfirm.value = false;

	const result = await store.releasePayout(id, {
		checkNo: checkNo.value.trim(),
		file: file.value,
	});

	if (result) {
		toast.add({
			title: "Payout Submitted",
			description: "Your check proof was submitted successfully.",
			color: "success",
		});

		resetForm();
		await loadPayouts();
	} else {
		toast.add({
			title: "Submission Failed",
			description: errorMessage.value || "Please try again.",
			color: "error",
		});
	}
}

watch(
	() => props.program,
	() => resetForm(),
);

onMounted(loadPayouts);
onUnmounted(clearPreview);
</script>

<template>
	<div class="min-h-screen bg-slate-50 p-4 dark:bg-slate-950">
		<div class="mx-auto max-w-4xl space-y-6 py-6">
			<!-- HEADER -->
			<UCard>
				<div class="flex flex-wrap items-center justify-between gap-4">
					<div class="flex items-center gap-3">
						<div
							class="rounded-lg p-3 text-white"
							:class="program === 'TES' ? 'bg-indigo-600' : 'bg-sky-600'"
						>
							<UIcon
								name="i-lucide-wallet"
								class="size-6"
							/>
						</div>

						<div>
							<h1 class="text-xl font-semibold">{{ program }} Scholarship Payout</h1>
							<p class="text-sm text-slate-500">View and submit your scholarship payout records.</p>
						</div>
					</div>

					<UButton
						color="neutral"
						variant="outline"
						icon="i-lucide-refresh-cw"
						:loading="isLoading"
						@click="loadPayouts"
					>
						Refresh
					</UButton>
				</div>
			</UCard>

			<!-- LOADING -->
			<UCard v-if="isLoading">
				<div class="flex items-center gap-3 py-6">
					<UIcon
						name="i-lucide-loader-circle"
						class="size-6 animate-spin"
					/>
					Loading your payouts...
				</div>
			</UCard>

			<!-- ERROR -->
			<UAlert
				v-else-if="loadFailed"
				color="error"
				variant="soft"
				title="Unable to load payouts"
				:description="errorMessage || 'Please try again.'"
			/>

			<template v-else>
				<UAlert
					v-if="unverifiedCount > 0"
					color="warning"
					variant="soft"
					icon="i-lucide-shield-alert"
					title="Scholarship Verification Required"
					:description="`${unverifiedCount} payout record(s) have not been associated with a verified TES or TDP application. They cannot be claimed from this portal yet.`"
				/>

				<!-- STATISTICS -->
				<div class="grid gap-4 sm:grid-cols-3">
					<UCard>
						<p class="text-sm text-slate-500">Total Payouts</p>
						<p class="mt-2 text-2xl font-bold">
							{{ verifiedPayouts.length }}
						</p>
					</UCard>

					<UCard>
						<p class="text-sm text-slate-500">Claimable Payouts</p>
						<p class="mt-2 text-2xl font-bold">
							{{ claimablePayouts.length }}
						</p>
					</UCard>

					<UCard>
						<p class="text-sm text-slate-500">Total Amount</p>
						<p class="mt-2 text-2xl font-bold">
							{{ formatAmount(totalAmount) }}
						</p>
					</UCard>
				</div>

				<!-- EMPTY -->
				<UCard v-if="verifiedPayouts.length === 0">
					<div class="py-10 text-center">
						<UIcon
							name="i-lucide-inbox"
							class="mx-auto mb-3 size-10 text-slate-400"
						/>
						<h2 class="font-semibold">No Verified {{ program }} Payouts</h2>
						<p class="mt-2 text-sm text-slate-500">
							No payouts have been verified for this scholarship program.
						</p>
					</div>
				</UCard>

				<!-- PAYOUT LIST -->
				<div
					v-else
					class="space-y-4"
				>
					<h2 class="text-lg font-semibold">Your Payout Records</h2>

					<UCard
						v-for="payout in verifiedPayouts"
						:key="payout.id"
					>
						<div class="space-y-4">
							<div class="flex flex-wrap justify-between gap-3">
								<div>
									<p class="text-sm text-slate-500">Semester {{ payout.semester }}</p>
									<p class="mt-1 text-xl font-bold">
										{{ formatAmount(payout.amount) }}
									</p>
								</div>

								<UBadge
									:color="
										payout.isClaimable && payout.status.toLowerCase() === 'pending'
											? 'success'
											: 'neutral'
									"
									variant="soft"
								>
									{{
										payout.isClaimable && payout.status.toLowerCase() === "pending"
											? "Claimable"
											: payout.status
									}}
								</UBadge>
							</div>

							<div class="grid gap-3 text-sm sm:grid-cols-2">
								<div>
									<p class="text-slate-500">Check Number</p>
									<p class="font-medium">
										{{ payout.checkNo || "Not submitted" }}
									</p>
								</div>

								<div>
									<p class="text-slate-500">Released At</p>
									<p class="font-medium">
										{{ formatDate(payout.releasedAt) }}
									</p>
								</div>
							</div>

							<UButton
								v-if="payout.isClaimable && payout.status.toLowerCase() === 'pending'"
								block
								icon="i-lucide-file-check"
								@click="selectPayout(payout.id)"
							>
								Submit Check Proof
							</UButton>
						</div>
					</UCard>
				</div>

				<!-- SUBMISSION -->
				<UCard v-if="selectedPayout">
					<div class="space-y-5">
						<div>
							<h2 class="text-lg font-semibold">Submit {{ program }} Check Proof</h2>
							<p class="text-sm text-slate-500">
								Semester {{ selectedPayout.semester }} —
								{{ formatAmount(selectedPayout.amount) }}
							</p>
						</div>

						<UFormField
							label="Check Number"
							required
						>
							<UInput
								v-model="checkNo"
								placeholder="Enter check number"
								maxlength="100"
								class="w-full"
							/>
						</UFormField>

						<UFormField label="Check Image (Optional)">
							<div class="space-y-3">
								<UButton
									color="neutral"
									variant="outline"
									icon="i-lucide-upload"
									@click="openFile"
								>
									Upload JPEG or PNG
								</UButton>

								<input
									ref="fileInput"
									type="file"
									accept="image/jpeg,image/png"
									class="hidden"
									@change="handleFile"
								/>

								<p
									v-if="file"
									class="break-all text-sm text-slate-500"
								>
									{{ file.name }}
								</p>

								<img
									v-if="preview"
									:src="preview"
									alt="Check proof preview"
									class="max-h-48 rounded-lg border object-contain"
								/>
							</div>
						</UFormField>

						<div class="flex gap-3">
							<UButton
								color="neutral"
								variant="outline"
								@click="resetForm"
							>
								Cancel
							</UButton>

							<UButton
								icon="i-lucide-send"
								:disabled="!canSubmit"
								:loading="isSaving"
								@click="confirmSubmission"
							>
								Submit Payout
							</UButton>
						</div>
					</div>
				</UCard>
			</template>
		</div>

		<!-- CONFIRMATION -->
		<UModal
			v-model:open="showConfirm"
			title="Confirm Payout Submission"
			description="Verify your check number before submitting."
		>
			<template #body>
				<div class="space-y-3">
					<p>
						Program: <strong>{{ program }}</strong>
					</p>

					<p>
						Check Number: <strong>{{ checkNo }}</strong>
					</p>

					<p v-if="selectedPayout">
						Amount:
						<strong>{{ formatAmount(selectedPayout.amount) }}</strong>
					</p>

					<div class="flex justify-end gap-2 pt-4">
						<UButton
							color="neutral"
							variant="outline"
							@click="showConfirm = false"
						>
							Cancel
						</UButton>

						<UButton
							:loading="isSaving"
							:disabled="!canSubmit"
							@click="submitPayout"
						>
							Confirm Submission
						</UButton>
					</div>
				</div>
			</template>
		</UModal>
	</div>
</template>
