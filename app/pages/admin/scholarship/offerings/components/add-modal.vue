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
			<UForm
				:schema="schema"
				:state="state"
				class="space-y-4"
				@submit="onSubmit"
			>
				<UFormField
					label="Academic Year"
					name="academicYear"
				>
					<UInput v-model="state.academicYear" />
				</UFormField>

				<UFormField
					label="Semester"
					name="semester"
				>
					<USelect
						v-model="state.semester"
						:items="['1', '2']"
					/>
				</UFormField>

				<UFormField
					label="Budget"
					name="allocatedBudget"
				>
					<UInput
						v-model.number="state.allocatedBudget"
						type="number"
					/>
				</UFormField>

				<UFormField
					label="Slots"
					name="availableSlots"
				>
					<UInput
						v-model.number="state.availableSlots"
						type="number"
					/>
				</UFormField>

				<UFormField
					label="Status"
					name="status"
				>
					<USelect
						v-model="state.status"
						:items="['draft', 'open', 'closed', 'archived']"
					/>
				</UFormField>

				<div class="flex justify-end pt-4">
					<UButton
						type="submit"
						:loading="offeringStore.isLoading"
					>
						Save
					</UButton>
				</div>
			</UForm>
		</template>
	</UModal>
</template>
