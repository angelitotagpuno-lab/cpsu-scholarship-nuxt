<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";
import type { ScholarshipOffering } from "~/types/scholarship-offering";

const store = useScholarshipOfferingStore();
const toast = useToast();

const props = defineProps<{
	data: ScholarshipOffering;
}>();

const emit = defineEmits<{
	close: [boolean];
}>();

/* =========================
   VALIDATION SCHEMA
========================= */
const schema = z.object({
	academicYear: z.string().min(1),
	semester: z.enum(["1", "2"]),
	allocatedBudget: z.number().min(1),
	availableSlots: z.number().nullable().optional(),
	status: z.enum(["draft", "open", "closed", "archived"]),
});

type Schema = z.output<typeof schema>;

/* =========================
   FORM STATE (pre-filled)
========================= */
const state = reactive<Schema>({
	academicYear: "",
	semester: "1",
	allocatedBudget: 1,
	availableSlots: null,
	status: "draft",
});

/* =========================
   SYNC PROP → FORM
========================= */
watch(
	() => props.data,
	(val) => {
		if (!val) return;

		state.academicYear = val.academicYear ?? "";
		state.semester = (val.semester as "1" | "2") ?? "1";
		state.allocatedBudget = Number(val.allocatedBudget ?? 0);
		state.availableSlots = val.availableSlots ?? null;
		state.status = val.status ?? "draft";
	},
	{ immediate: true },
);

/* =========================
   SUBMIT UPDATE
========================= */
async function onSubmit(event: FormSubmitEvent<Schema>) {
	if (!props.data?.id) return;

	await store.editOffering(props.data.id, {
		...event.data,
	});

	if (store.errorMessage) return;

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
				<!-- HEADER (Course-style UI) -->
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
								size="lg"
							/>
						</UFormField>
					</div>

					<div class="flex justify-end border-t border-slate-200 pt-4 dark:border-slate-800 gap-2">
						<UButton
							variant="soft"
							color="neutral"
							@click="emit('close', false)"
						>
							Cancel
						</UButton>

						<UButton
							type="submit"
							:loading="store.isLoading"
							class="bg-blue-600 hover:bg-blue-700"
						>
							Update Offering
						</UButton>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
