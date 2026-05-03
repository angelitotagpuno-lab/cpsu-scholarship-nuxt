<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

const store = useScholarshipStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const errorMessage = ref("");

const schema = z.object({
	code: z.string().optional(),
	name: z.string().min(1),
	description: z.string().optional(),
	intakeType: z.enum(["public_application", "staff_nomination"]),
	defaultAmountPerSemester: z.number().min(1),
	isActive: z.boolean(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
	code: "",
	name: "",
	description: "",
	intakeType: "public_application",
	defaultAmountPerSemester: 1,
	isActive: true,
});

const intakeOptions = [
	{ label: "Public Application", value: "public_application" },
	{ label: "Staff Nomination", value: "staff_nomination" },
];

async function onSubmit(event: FormSubmitEvent<Schema>) {
	await store.create(event.data);

	if (store.error) {
		errorMessage.value = store.error;
		return;
	}

	toast.add({
		title: "Success",
		description: "Scholarship created successfully",
		color: "success",
	});

	emit("close", true);
}
</script>

<template>
	<UModal title="Add Scholarship">
		<template #body>
			<div class="space-y-6">
				<!-- HEADER CARD -->
				<div
					class="rounded-lg bg-emerald-50 p-4 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:ring-emerald-900"
				>
					<div class="flex items-start gap-3">
						<div class="rounded-md bg-emerald-600 p-2 text-white">
							<UIcon
								name="i-lucide-graduation-cap"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-base font-semibold text-slate-900 dark:text-white">
								Create scholarship program
							</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400">
								Fill in scholarship details, funding, and intake type.
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
					title="Unable to create scholarship"
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
						<!-- CODE -->
						<UFormField
							label="Code"
							name="code"
						>
							<UInput
								v-model="state.code"
								class="w-full"
								size="lg"
								icon="i-lucide-hash"
								placeholder="TES, TDP (optional)"
							/>
						</UFormField>

						<!-- NAME -->
						<UFormField
							label="Name"
							name="name"
							class="sm:col-span-2"
						>
							<UInput
								v-model="state.name"
								class="w-full"
								size="lg"
								icon="i-lucide-book-open"
								placeholder="Scholarship name"
							/>
						</UFormField>

						<!-- DESCRIPTION -->
						<UFormField
							label="Description"
							name="description"
							class="sm:col-span-2"
						>
							<UInput
								v-model="state.description"
								class="w-full"
								size="lg"
								icon="i-lucide-align-left"
								placeholder="Optional description"
							/>
						</UFormField>

						<!-- INTAKE TYPE -->
						<UFormField
							label="Intake Type"
							name="intakeType"
						>
							<USelect
								v-model="state.intakeType"
								class="w-full"
								size="lg"
								:items="intakeOptions"
								label-key="label"
								value-key="value"
								placeholder="Select intake type"
							/>
						</UFormField>

						<!-- AMOUNT -->
						<UFormField
							label="Amount per Semester"
							name="defaultAmountPerSemester"
						>
							<UInput
								v-model.number="state.defaultAmountPerSemester"
								type="number"
								class="w-full"
								size="lg"
								icon="i-lucide-banknote"
								placeholder="Enter amount"
							/>
						</UFormField>

						<!-- ACTIVE -->
						<UFormField
							label="Active Status"
							name="isActive"
							class="sm:col-span-2"
						>
							<div class="flex items-center justify-between">
								<p class="text-sm text-slate-500">Enable or disable this scholarship program</p>
								<USwitch v-model="state.isActive" />
							</div>
						</UFormField>
					</div>

					<!-- ACTIONS -->
					<div class="flex justify-end border-t border-slate-200 pt-4 dark:border-slate-800">
						<UButton
							type="submit"
							:loading="store.loading"
							icon="i-lucide-save"
							color="primary"
							class="bg-emerald-600 hover:bg-emerald-700"
						>
							Save Scholarship
						</UButton>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
