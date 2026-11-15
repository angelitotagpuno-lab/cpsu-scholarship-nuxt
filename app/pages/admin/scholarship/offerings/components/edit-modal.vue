<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { ScholarshipOffering } from "~/types/scholarship-offering";
import { reactive, ref, watch } from "vue";
import z from "zod";

const store = useScholarshipOfferingStore();
const toast = useToast();

const props = defineProps<{
	data: ScholarshipOffering;
}>();

const emit = defineEmits<{ close: [boolean] }>();
const errorMessage = ref("");

const moneySchema = z.coerce.number<number>().min(0, "Amount cannot be negative");

const schema = z.object({
	schoolYear: z.string().trim().min(1, "School year is required").max(20),
	totalBudget: moneySchema,
	amountPerSemester: moneySchema,
	pwdAdditional: moneySchema,
	isActive: z.boolean(),
	isArchived: z.boolean(),
});

type Schema = z.output<typeof schema>;

const state = reactive({
	schoolYear: "",
	totalBudget: 0,
	amountPerSemester: 0,
	pwdAdditional: 0,
	isActive: true,
	isArchived: false,
});

watch(
	() => props.data,
	(val) => {
		if (!val) return;

		state.schoolYear = val.schoolYear ?? "";
		state.totalBudget = Number(val.totalBudget ?? 0);
		state.amountPerSemester = Number(val.amountPerSemester ?? 0);
		state.pwdAdditional = Number(val.pwdAdditional ?? 0);
		state.isActive = val.isActive;
		state.isArchived = val.isArchived;
	},
	{ immediate: true },
);

function toMoney(value: number): string {
	return value.toFixed(2);
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
	if (!props.data?.id) return;

	errorMessage.value = "";

	const success = await store.editOffering(props.data.id, {
		schoolYear: event.data.schoolYear,
		totalBudget: toMoney(event.data.totalBudget),
		amountPerSemester: toMoney(event.data.amountPerSemester),
		pwdAdditional: toMoney(event.data.pwdAdditional),
		isActive: event.data.isActive,
		isArchived: event.data.isArchived,
	});

	if (!success) {
		errorMessage.value = store.errorMessage || "Failed to update offering";
		return;
	}

	toast.add({
		title: "Success",
		description: "Offering updated successfully",
		color: "success",
	});

	emit("close", true);
}
</script>

<template>
	<UModal title="Edit Offering">
		<template #body>
			<div class="space-y-6">
				<!-- HEADER -->
				<div
					class="rounded-lg bg-blue-50 p-4 ring-1 ring-blue-100 dark:bg-blue-950/30 dark:ring-blue-900"
				>
					<div class="flex items-start gap-3">
						<div class="rounded-md bg-blue-600 p-2 text-white">
							<UIcon
								name="i-lucide-pencil"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-base font-semibold text-slate-900 dark:text-white">
								Update Offering
							</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400">
								Modify offering details and settings.
							</p>
						</div>
					</div>
				</div>

				<UAlert
					v-if="errorMessage"
					icon="i-lucide-circle-alert"
					color="error"
					variant="soft"
					title="Update failed"
					:description="errorMessage"
				/>

				<UForm
					:schema="schema"
					:state="state"
					class="space-y-5"
					@submit="onSubmit"
				>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<UFormField
							label="School Year"
							name="schoolYear"
						>
							<UInput
								v-model="state.schoolYear"
								placeholder="e.g. 2026 - 2027"
								icon="i-lucide-calendar"
								class="w-full"
								size="lg"
							/>
						</UFormField>

						<UFormField
							label="Total Budget"
							name="totalBudget"
						>
							<UInput
								v-model.number="state.totalBudget"
								type="number"
								min="0"
								step="0.01"
								icon="i-lucide-wallet"
								class="w-full"
								size="lg"
							/>
						</UFormField>

						<UFormField
							label="Amount Per Semester"
							name="amountPerSemester"
						>
							<UInput
								v-model.number="state.amountPerSemester"
								type="number"
								min="0"
								step="0.01"
								icon="i-lucide-banknote"
								class="w-full"
								size="lg"
							/>
						</UFormField>

						<UFormField
							label="PWD Additional"
							name="pwdAdditional"
						>
							<UInput
								v-model.number="state.pwdAdditional"
								type="number"
								min="0"
								step="0.01"
								icon="i-lucide-wallet"
								class="w-full"
								size="lg"
							/>
						</UFormField>
					</div>

					<div class="space-y-3">
						<UFormField
							label="Active"
							name="isActive"
						>
							<div
								class="flex items-center justify-between rounded-lg border p-3 dark:border-slate-800"
							>
								<span class="text-sm text-slate-600 dark:text-slate-300"> Enable offering </span>
								<USwitch v-model="state.isActive" />
							</div>
						</UFormField>

						<UFormField
							label="Archived"
							name="isArchived"
						>
							<div
								class="flex items-center justify-between rounded-lg border p-3 dark:border-slate-800"
							>
								<span class="text-sm text-slate-600 dark:text-slate-300"> Archive offering </span>
								<USwitch v-model="state.isArchived" />
							</div>
						</UFormField>
					</div>

					<div class="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
						<UButton
							type="button"
							variant="soft"
							color="neutral"
							:disabled="store.isLoading"
							@click="emit('close', false)"
						>
							Cancel
						</UButton>

						<UButton
							type="submit"
							:loading="store.isLoading"
							class="bg-blue-600 hover:bg-blue-700 text-white"
						>
							Update Offering
						</UButton>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
