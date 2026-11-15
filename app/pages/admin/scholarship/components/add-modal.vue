<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

const store = useScholarshipStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const errorMessage = ref("");

const schema = z.object({
	name: z.string().trim().min(1, "Name is required"),
	description: z.string().optional(),
	isArchived: z.boolean(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
	name: "",
	description: "",
	isArchived: false,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
	errorMessage.value = "";

	const success = await store.create({
		name: event.data.name,
		description: event.data.description || null,
		isArchived: event.data.isArchived,
	});

	if (!success) {
		errorMessage.value = store.error || "Failed to create scholarship program";

		toast.add({
			title: "Error",
			description: errorMessage.value,
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
				<!-- HEADER -->
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
								Fill in scholarship program details.
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
						label="Archived"
						name="isArchived"
					>
						<div
							class="flex items-center justify-between rounded-lg border p-3 dark:border-slate-800"
						>
							<div>
								<p class="text-sm text-slate-600 dark:text-slate-300">
									Archive scholarship program
								</p>
								<p class="text-xs text-slate-500">Archived programs are marked inactive.</p>
							</div>
							<USwitch v-model="state.isArchived" />
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
