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
			<UForm
				:schema="schema"
				:state="state"
				class="space-y-4"
				@submit="onSubmit"
			>
				<!-- Academic Year -->
				<UFormField
					label="Academic Year"
					name="academicYear"
				>
					<UInput v-model="state.academicYear" />
				</UFormField>

				<!-- Semester -->
				<UFormField
					label="Semester"
					name="semester"
				>
					<USelect
						v-model="state.semester"
						:items="['1', '2']"
					/>
				</UFormField>

				<!-- Budget -->
				<UFormField
					label="Budget"
					name="allocatedBudget"
				>
					<UInput
						v-model.number="state.allocatedBudget"
						type="number"
					/>
				</UFormField>

				<!-- Slots -->
				<UFormField
					label="Slots"
					name="availableSlots"
				>
					<UInput
						v-model.number="state.availableSlots"
						type="number"
					/>
				</UFormField>

				<!-- Status -->
				<UFormField
					label="Status"
					name="status"
				>
					<USelect
						v-model="state.status"
						:items="['draft', 'open', 'closed', 'archived']"
					/>
				</UFormField>

				<!-- Actions -->
				<div class="flex justify-end pt-4 gap-2">
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
						color="primary"
					>
						Update
					</UButton>
				</div>
			</UForm>
		</template>
	</UModal>
</template>
