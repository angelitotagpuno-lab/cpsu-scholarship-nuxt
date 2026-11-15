<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { reactive, ref } from "vue";
import z from "zod";

const offeringStore = useScholarshipOfferingStore();
const toast = useToast();

const props = defineProps<{ programId: string }>();
const emit = defineEmits<{ close: [boolean] }>();

const errorMessage = ref("");

const moneySchema = z.coerce.number<number>().min(0, "Amount cannot be negative");

const schema = z.object({
	schoolYear: z.string().trim().min(1, "School year is required").max(20),
	totalBudget: moneySchema,
	amountPerSemester: moneySchema,
	pwdAdditional: moneySchema,
});

type Schema = z.output<typeof schema>;

const state = reactive({
	schoolYear: "",
	totalBudget: 0,
	amountPerSemester: 0,
	pwdAdditional: 0,
});

function toMoney(value: number): string {
	return value.toFixed(2);
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
	errorMessage.value = "";

	const success = await offeringStore.addOffering({
		scholarshipProgramId: props.programId,
		schoolYear: event.data.schoolYear,
		totalBudget: toMoney(event.data.totalBudget),
		amountPerSemester: toMoney(event.data.amountPerSemester),
		pwdAdditional: toMoney(event.data.pwdAdditional),
	});

	if (!success) {
		errorMessage.value = offeringStore.errorMessage || "Failed to create offering";
		return;
	}

	toast.add({
		title: "Success",
		description: "Offering created",
		color: "success",
	});

	emit("close", true);
}
</script>

<template>
	<UModal title="Add Offering">
		<template #body>
			<div class="space-y-6">
				<!-- HEADER -->
				<div
					class="rounded-lg bg-emerald-50 p-4 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:ring-emerald-900"
				>
					<div class="flex items-start gap-3">
						<div class="rounded-md bg-emerald-600 p-2 text-white">
							<UIcon
								name="i-lucide-plus-circle"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-base font-semibold text-slate-900 dark:text-white">
								Create Offering
							</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400">
								Set school year, budget, and scholarship amounts.
							</p>
						</div>
					</div>
				</div>

				<UAlert
					v-if="errorMessage"
					color="error"
					variant="soft"
					icon="i-lucide-circle-alert"
					title="Unable to create offering"
					:description="errorMessage"
				/>

				<!-- FORM -->
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
								placeholder="Enter total budget"
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
								placeholder="Enter semester amount"
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
								placeholder="Enter PWD additional amount"
								icon="i-lucide-wallet"
								class="w-full"
								size="lg"
							/>
						</UFormField>
					</div>

					<div class="flex justify-end border-t border-slate-200 pt-4 dark:border-slate-800">
						<UButton
							type="submit"
							:loading="offeringStore.isLoading"
							icon="i-lucide-save"
							class="bg-emerald-600 hover:bg-emerald-700 text-white"
						>
							Save Offering
						</UButton>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
