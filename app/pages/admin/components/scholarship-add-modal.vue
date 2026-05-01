<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const schema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	funds: z.number().min(1, "Funds must be greater than 0"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
	name: "",
	description: "",
	funds: 0,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
	console.log("Scholarship Data:", event.data);

	toast.add({
		title: "Success",
		description: "Scholarship program added successfully",
		color: "success",
	});

	emit("close", true);
}
</script>

<template>
	<UModal title="Add Scholarship Program">
		<template #body>
			<div class="space-y-6">
				<!-- Header -->
				<div
					class="rounded-lg bg-emerald-50 p-4 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:ring-emerald-900"
				>
					<div class="flex items-start gap-3">
						<div class="rounded-md bg-emerald-600 p-2 text-white">
							<UIcon
								name="i-lucide-award"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-base font-semibold text-slate-900 dark:text-white">
								Create scholarship program
							</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400">
								Fill in the details below to publish a new scholarship.
							</p>
						</div>
					</div>
				</div>

				<UForm
					:schema="schema"
					:state="state"
					class="space-y-5"
					@submit="onSubmit"
				>
					<UFormField
						label="Program Name"
						name="name"
					>
						<UInput
							v-model="state.name"
							size="lg"
							icon="i-lucide-graduation-cap"
							placeholder="e.g. Academic Excellence Scholarship"
							class="w-full"
						/>
					</UFormField>

					<UFormField
						label="Description"
						name="description"
					>
						<UTextarea
							v-model="state.description"
							:rows="4"
							placeholder="Supports high-achieving students in IT and Engineering programs..."
							class="w-full"
						/>
					</UFormField>

					<UFormField
						label="Total Funds"
						name="funds"
					>
						<UInput
							v-model.number="state.funds"
							size="lg"
							type="number"
							icon="i-lucide-wallet"
							placeholder="e.g. 50000"
							class="w-full"
						/>
					</UFormField>

					<div class="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
						<UButton
							color="neutral"
							variant="outline"
							@click="emit('close', false)"
						>
							Cancel
						</UButton>

						<UButton
							type="submit"
							color="primary"
							icon="i-lucide-save"
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
