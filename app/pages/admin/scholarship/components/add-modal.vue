<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

const store = useScholarshipStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const errorMessage = ref("");

const schema = z.object({
	code: z.string().optional(),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	intakeType: z.enum(["public_application", "staff_nomination"]),
	defaultAmountPerSemester: z.number().min(1, "Amount is required"),
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
	errorMessage.value = "";

	await store.create({
		...event.data,
		code: event.data.code || undefined,
		description: event.data.description || undefined,
		defaultAmountPerSemester: Number(event.data.defaultAmountPerSemester),
	});

	if (store.error) {
		errorMessage.value = store.error;

		toast.add({
			title: "Error",
			description: store.error,
			color: "error",
		});
		return;
	}

	toast.add({
		title: "Success",
		description: "Scholarship program created",
		color: "success",
	});

	emit("close", true);
}
</script>

<template>
	<UModal title="Add Scholarship Program">
		<template #body>
			<div class="space-y-6">
				<!-- HEADER (Course-style card) -->
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
								Fill in scholarship details and funding configuration.
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

				<!-- FORM (COURSE STYLE) -->
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

					<UFormField
						label="Intake Type"
						name="intakeType"
					>
						<USelect
							v-model="state.intakeType"
							class="w-full"
							size="lg"
							icon="i-lucide-list"
							:items="intakeOptions"
							label-key="label"
							value-key="value"
							placeholder="Select intake type"
						/>
					</UFormField>

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

					<!-- FOOTER -->
					<div class="flex justify-end border-t border-slate-200 pt-4 dark:border-slate-800">
						<UButton
							type="submit"
							:loading="store.loading"
							icon="i-lucide-save"
							color="primary"
							class="bg-emerald-600 hover:bg-emerald-700"
						>
							Submit
						</UButton>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
