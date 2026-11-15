<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useFileStore } from "~/stores/file.store";

const fileStore = useFileStore();
const toast = useToast();

const files = ref<File[]>([]);

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedExtensions = ["xlsx", "xls", "csv", "docx", "doc"];

const hasFiles = computed(() => files.value.length > 0);

const successfulUploads = computed(() => fileStore.uploadResults.filter((r) => r.success));

const failedUploads = computed(() => fileStore.uploadResults.filter((r) => !r.success));

watch(files, () => {
	fileStore.reset();
});

function validateFiles(): string | null {
	if (!files.value.length) {
		return "Please select at least one file.";
	}

	for (const file of files.value) {
		const extension = file.name.split(".").pop()?.toLowerCase();

		if (!extension || !allowedExtensions.includes(extension)) {
			return `${file.name} has an unsupported file type.`;
		}

		if (file.size > MAX_FILE_SIZE) {
			return `${file.name} exceeds the 5MB limit.`;
		}
	}

	return null;
}

async function handleUpload() {
	if (fileStore.isLoading) return;

	const validationError = validateFiles();

	if (validationError) {
		toast.add({
			title: "Validation Error",
			description: validationError,
			color: "error",
		});
		return;
	}

	const success = await fileStore.uploadFiles(files.value);

	if (success) {
		toast.add({
			title: "Upload Successful",
			description: "All files uploaded successfully.",
			color: "success",
		});

		files.value = [];
	} else {
		toast.add({
			title: "Upload Incomplete",
			description: fileStore.errorMessage || "Some files failed to upload.",
			color: "error",
		});
	}
}
</script>

<template>
	<div class="space-y-5">
		<div>
			<h2 class="text-lg font-semibold text-slate-900 dark:text-white">Upload Dataset</h2>

			<p class="text-sm text-slate-500 dark:text-slate-400">
				Select your dataset files and upload them to the system.
			</p>
		</div>

		<UFileUpload
			v-model="files"
			icon="i-lucide-file-text"
			label="Drop your dataset files here"
			description="Excel, CSV, Word files (max. 5MB each)."
			layout="grid"
			multiple
			:interactive="false"
			:disabled="fileStore.isLoading"
			class="min-h-48 w-full"
			accept=".xlsx,.xls,.csv,.docx,.doc"
		>
			<template #actions="{ open }">
				<UButton
					label="Select files"
					icon="i-lucide-upload"
					color="neutral"
					variant="outline"
					:disabled="fileStore.isLoading"
					@click="open()"
				/>
			</template>

			<template #files-top="{ open, files: selectedFiles }">
				<div
					v-if="selectedFiles?.length"
					class="mb-2 flex items-center justify-between"
				>
					<p class="font-bold">Files Selected ({{ selectedFiles.length }})</p>

					<UButton
						icon="i-lucide-plus"
						label="Add more"
						color="neutral"
						variant="outline"
						class="-my-2"
						:disabled="fileStore.isLoading"
						@click="open()"
					/>
				</div>
			</template>
		</UFileUpload>

		<div
			v-if="hasFiles"
			class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800"
		>
			<p class="mb-2 text-sm font-semibold">Ready to Upload</p>

			<div
				v-for="(file, index) in files"
				:key="`${file.name}-${index}`"
				class="flex items-center justify-between py-1 text-sm"
			>
				<span class="max-w-[75%] truncate">
					{{ file.name }}
				</span>

				<span class="text-xs text-slate-500"> {{ (file.size / 1024 / 1024).toFixed(2) }} MB </span>
			</div>
		</div>

		<UButton
			block
			size="lg"
			icon="i-lucide-cloud-upload"
			color="primary"
			:loading="fileStore.isLoading"
			:disabled="!hasFiles || fileStore.isLoading"
			@click="handleUpload"
		>
			{{ fileStore.isLoading ? "Uploading..." : "Upload Files" }}
		</UButton>

		<UAlert
			v-if="fileStore.errorMessage"
			color="error"
			variant="soft"
			icon="i-lucide-circle-alert"
			title="Upload Error"
			:description="fileStore.errorMessage"
		/>

		<div
			v-if="fileStore.uploadResults.length"
			class="space-y-2"
		>
			<p class="text-sm font-semibold">Upload Results</p>

			<div
				v-for="(result, index) in fileStore.uploadResults"
				:key="index"
				class="flex items-start gap-2 rounded-md p-3 text-sm"
				:class="
					result.success
						? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300'
						: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300'
				"
			>
				<UIcon
					:name="result.success ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
					class="mt-0.5 size-4 shrink-0"
				/>

				<div class="min-w-0">
					<p class="break-all font-medium">
						{{ result.name }}
					</p>

					<p
						v-if="!result.success"
						class="text-xs"
					>
						{{ result.error }}
					</p>
				</div>
			</div>

			<p class="text-xs text-slate-500">
				Successful: {{ successfulUploads.length }} | Failed: {{ failedUploads.length }}
			</p>
		</div>
	</div>
</template>
