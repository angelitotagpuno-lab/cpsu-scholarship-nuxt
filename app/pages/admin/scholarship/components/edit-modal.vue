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
				<!-- HEADER (matched style with create modal) -->
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
							<h3 class="text-base font-semibold text-slate-900 dark:text-white">
								Edit scholarship program
							</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400">
								Update scholarship details and configuration.
							</p>
						</div>
					</div>
				</div>

				<!-- ERROR -->
				<UAlert
					v-if="errorMessage"
					icon="i-lucide-circle-alert"
					color="error"
					variant="soft"
					title="Update failed"
					:description="errorMessage"
				/>

				<!-- FORM -->
				<UForm
					:schema="schema"
					:state="state"
					class="space-y-5"
					@submit="onSubmit"
				>
					<!-- BASIC INFO -->
					<div class="space-y-4">
						<UFormField
							label="Code"
							name="code"
						>
							<UInput
								v-model="state.code"
								class="w-full"
								size="lg"
								icon="i-lucide-tag"
								placeholder="TES, TDP..."
							/>
						</UFormField>

						<UFormField
							label="Name"
							name="name"
						>
							<UInput
								v-model="state.name"
								class="w-full"
								size="lg"
								icon="i-lucide-graduation-cap"
								placeholder="Scholarship name"
							/>
						</UFormField>

						<UFormField
							label="Description"
							name="description"
						>
							<UInput
								v-model="state.description"
								class="w-full"
								size="lg"
								icon="i-lucide-file-text"
								placeholder="Optional description"
							/>
						</UFormField>
					</div>

					<!-- SETTINGS -->
					<div class="space-y-4">
						<UFormField
							label="Amount per Semester"
							name="defaultAmountPerSemester"
						>
							<UInput
								v-model.number="state.defaultAmountPerSemester"
								class="w-full"
								size="lg"
								icon="i-lucide-wallet"
								type="number"
								placeholder="Enter amount"
							/>
						</UFormField>

						<UFormField
							label="Active"
							name="isActive"
						>
							<div
								class="flex items-center justify-between rounded-lg border p-3 dark:border-slate-800"
							>
								<span class="text-sm text-slate-600 dark:text-slate-300">
									Enable scholarship program
								</span>
								<USwitch v-model="state.isActive" />
							</div>
						</UFormField>
					</div>

					<!-- FOOTER -->
					<div class="flex justify-end border-t border-slate-200 pt-4 dark:border-slate-800">
						<UButton
							type="submit"
							:loading="store.loading"
							icon="i-lucide-save"
							class="bg-blue-600 hover:bg-blue-700 text-white"
						>
							Update Scholarship
						</UButton>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
