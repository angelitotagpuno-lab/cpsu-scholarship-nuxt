<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

const emit = defineEmits<{ close: [boolean] }>();

/* =========================
   LOCAL UI STATE (NO STORE)
========================= */
const state = reactive<{
	file: File | null;
}>({
	file: null,
});

/* =========================
   VALIDATION (UI ONLY)
========================= */
const schema = z.object({
	file: z.any().refine((val) => val instanceof File, {
		message: "File is required",
	}),
});

type Schema = z.output<typeof schema>;

/* =========================
   SUBMIT (UI ONLY)
========================= */
async function onSubmit(event: FormSubmitEvent<Schema>) {
	console.log("📤 FILE SELECTED:", event.data.file);

	// UI ONLY — no API yet
	emit("close", true);
}
</script>

<template>
	<UModal title="Import Student ID Roster">
		<template #body>
			<div class="space-y-6">
				<!-- HEADER -->
				<div
					class="rounded-lg bg-emerald-50 p-4 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:ring-emerald-900"
				>
					<div class="flex items-start gap-3">
						<div class="rounded-md bg-emerald-600 p-2 text-white">
							<UIcon
								name="i-lucide-upload"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-base font-semibold text-slate-900 dark:text-white">
								Import roster file
							</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400">
								Upload CSV / XLSX with headers: Student ID No., Name
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
					<UFormField
						label="File Upload"
						name="file"
					>
						<input
							type="file"
							accept=".csv,.xls,.xlsx,.tsv"
							class="block w-full border p-2 rounded"
							@change="
								(e) => {
									const target = e.target as HTMLInputElement;
									state.file = target.files?.[0] ?? null;
								}
							"
						/>

						<p class="text-xs text-gray-500 mt-2">
							Required columns: <b>Student ID No.</b>, <b>Name</b>
						</p>
					</UFormField>

					<div class="flex justify-end border-t border-slate-200 pt-4 dark:border-slate-800">
						<UButton
							type="submit"
							color="primary"
							class="bg-emerald-600 hover:bg-emerald-700"
						>
							Import
						</UButton>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
