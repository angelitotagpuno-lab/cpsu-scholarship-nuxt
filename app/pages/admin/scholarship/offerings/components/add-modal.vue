<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

const offeringStore = useScholarshipOfferingStore();
const toast = useToast();

const props = defineProps<{ programId: string }>();
const emit = defineEmits<{ close: [boolean] }>();

const schema = z.object({
	academicYear: z.string().min(1),
	semester: z.enum(["1", "2"]),
	allocatedBudget: z.number().min(1),
	availableSlots: z.number().nullable().optional(),
	status: z.enum(["draft", "open", "closed", "archived"]),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
	academicYear: "",
	semester: "1",
	allocatedBudget: 1,
	availableSlots: null,
	status: "draft",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
	await offeringStore.addOffering({
		...event.data,
		programId: props.programId,
	});

	if (offeringStore.errorMessage) return;

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
				<!-- HEADER (Course-style UI) -->
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
								Set academic year, budget, and available slots.
							</p>
						</div>
					</div>
				</div>

				<!-- FORM -->
				<UForm
					:schema="schema"
					:state="state"
					class="space-y-5"
					@submit="onSubmit"
				>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<UFormField
							label="Academic Year"
							name="academicYear"
						>
							<UInput
								v-model="state.academicYear"
								placeholder="e.g. 2025-2026"
								icon="i-lucide-calendar"
								class="w-full"
								size="lg"
							/>
						</UFormField>

						<UFormField
							label="Semester"
							name="semester"
						>
							<USelect
								v-model="state.semester"
								:items="['1', '2']"
								placeholder="Select semester"
								icon="i-lucide-book-open"
								class="w-full"
								size="lg"
							/>
						</UFormField>

						<UFormField
							label="Budget"
							name="allocatedBudget"
						>
							<UInput
								v-model.number="state.allocatedBudget"
								type="number"
								placeholder="Enter budget"
								icon="i-lucide-wallet"
								class="w-full"
								size="lg"
							/>
						</UFormField>

						<UFormField
							label="Slots"
							name="availableSlots"
						>
							<UInput
								v-model.number="state.availableSlots"
								type="number"
								placeholder="Optional slots"
								icon="i-lucide-users"
								class="w-full"
								size="lg"
							/>
						</UFormField>

						<UFormField
							label="Status"
							name="status"
						>
							<USelect
								v-model="state.status"
								:items="['draft', 'open', 'closed', 'archived']"
								placeholder="Select status"
								icon="i-lucide-activity"
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
							class="bg-emerald-600 hover:bg-emerald-700"
						>
							Save Offering
						</UButton>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
