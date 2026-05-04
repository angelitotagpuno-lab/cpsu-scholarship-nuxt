<script setup lang="ts">
import type { ScholarshipProgram } from "~/types/scholarship";
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

const props = defineProps<{ data: ScholarshipProgram }>();
const store = useScholarshipStore();
const emit = defineEmits<{ close: [boolean] }>();

const errorMessage = ref("");

const schema = z.object({
	code: z.string().optional(),
	name: z.string().min(1),
	description: z.string().optional(),
	intakeType: z.enum(["public_application", "staff_nomination"]),
	defaultAmountPerSemester: z.number(),
	isActive: z.boolean(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
	code: props.data.code ?? "",
	name: props.data.name,
	description: props.data.description ?? "",
	intakeType: props.data.intake_type,
	defaultAmountPerSemester: Number(props.data.default_amount_per_semester),
	isActive: props.data.is_active,
});

async function onSubmit(e: FormSubmitEvent<Schema>) {
	errorMessage.value = "";

	await store.updateItem(props.data.id, {
		...e.data,
		defaultAmountPerSemester: Number(e.data.defaultAmountPerSemester),
	});

	if (store.error) {
		errorMessage.value = store.error;
		return;
	}

	emit("close", true);
}
</script>

<template>
	<UModal title="Edit Scholarship Program">
		<template #body>
			<div class="space-y-6">
				<div
					class="rounded-lg bg-blue-50 p-4 ring-1 ring-blue-100 dark:bg-blue-950/30 dark:ring-blue-900"
				>
					<div class="flex items-start gap-3">
						<div class="rounded-md bg-blue-600 p-2 text-white">
							<UIcon
								name="i-lucide-edit"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-base font-semibold">Edit scholarship program</h3>
							<p class="text-sm text-slate-500">Update program details and settings.</p>
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
					<UFormField
						label="Code"
						name="code"
					>
						<UInput v-model="state.code" />
					</UFormField>

					<UFormField
						label="Name"
						name="name"
					>
						<UInput v-model="state.name" />
					</UFormField>

					<UFormField
						label="Description"
						name="description"
					>
						<UInput v-model="state.description" />
					</UFormField>

					<UFormField
						label="Amount"
						name="defaultAmountPerSemester"
					>
						<UInput
							v-model.number="state.defaultAmountPerSemester"
							type="number"
						/>
					</UFormField>

					<USwitch v-model="state.isActive" />

					<div class="flex justify-end border-t pt-4">
						<UButton
							type="submit"
							:loading="store.loading"
						>
							Update
						</UButton>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
