<script setup lang="ts">
import { reactive, ref } from "vue";
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";
import { useStudentAllowlistStore } from "~/stores/student-allowlist.store";

const emit = defineEmits<{ close: [boolean] }>();

const store = useStudentAllowlistStore();
const toast = useToast();

const result = ref<{
	totalRows: number;
	inserted: number;
	skipped: number;
	invalid: number;
	errors: { row: number; message: string }[];
} | null>(null);

const schema = z.object({
	file: z
		.custom<File>((value) => value instanceof File, "File is required")
		.refine(
			(file) => /\.(csv|xls|xlsx)$/i.test(file.name),
			"Only CSV, XLS, or XLSX files are allowed",
		),
});

type Schema = z.output<typeof schema>;

const state = reactive<{
	file: File | null;
}>({
	file: null,
});

function handleFileChange(event: Event) {
	const target = event.target as HTMLInputElement;

	state.file = target.files?.[0] ?? null;
	result.value = null;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
	const response = await store.importRoster(event.data.file);

	if (!response) {
		toast.add({
			title: "Import failed",
			description: store.errorMessage || "Unable to import roster.",
			color: "error",
		});
		return;
	}

	result.value = response;

	toast.add({
		title: "Import completed",
		description: `${response.inserted} records imported successfully.`,
		color: "success",
	});

	// Keep modal open if the backend reports invalid rows.
	if (response.invalid === 0) {
		emit("close", true);
	}
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
								Upload CSV, XLS, or XLSX with headers: Student ID No., Name
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
							accept=".csv,.xls,.xlsx"
							class="block w-full rounded border p-2 dark:border-slate-700"
							:disabled="store.isImporting"
							@change="handleFileChange"
						/>

						<p class="mt-2 text-xs text-gray-500">
							Required columns:
							<b>Student ID No.</b>, <b>Name</b>
						</p>
					</UFormField>

					<UAlert
						v-if="store.errorMessage"
						color="error"
						variant="soft"
						title="Import failed"
						:description="store.errorMessage"
					/>

					<!-- IMPORT RESULT -->
					<div
						v-if="result"
						class="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800"
					>
						<h3 class="font-semibold">Import Results</h3>

						<div class="grid grid-cols-2 gap-3 text-sm">
							<p>Total Rows: {{ result.totalRows }}</p>
							<p class="text-emerald-600">Inserted: {{ result.inserted }}</p>
							<p class="text-amber-600">Skipped: {{ result.skipped }}</p>
							<p class="text-red-600">Invalid: {{ result.invalid }}</p>
						</div>

						<div
							v-if="result.errors.length"
							class="space-y-1"
						>
							<p class="text-sm font-medium text-red-600">Row Errors</p>

							<p
								v-for="error in result.errors"
								:key="`${error.row}-${error.message}`"
								class="text-xs text-red-500"
							>
								Row {{ error.row }}:
								{{ error.message }}
							</p>
						</div>
					</div>

					<div class="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
						<UButton
							type="button"
							color="neutral"
							variant="outline"
							:disabled="store.isImporting"
							@click="emit('close', false)"
						>
							Close
						</UButton>

						<UButton
							type="submit"
							color="primary"
							icon="i-lucide-upload"
							:loading="store.isImporting"
							:disabled="!state.file || store.isImporting"
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
