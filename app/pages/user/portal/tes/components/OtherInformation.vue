<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useTesScholarFormStore } from "~/stores/tes-form.store";

const formStore = useTesScholarFormStore();
const toast = useToast();

type DocumentType = "pwd" | "ip" | "4ps";

const YES_NO_OPTIONS = ["Yes", "No"];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const pwdPreview = ref<string | null>(null);
const ipPreview = ref<string | null>(null);
const fourPsPreview = ref<string | null>(null);

const pwdInput = ref<HTMLInputElement | null>(null);
const ipInput = ref<HTMLInputElement | null>(null);
const fourPsInput = ref<HTMLInputElement | null>(null);

function clearPreview(type: DocumentType) {
	if (type === "pwd" && pwdPreview.value) {
		URL.revokeObjectURL(pwdPreview.value);
		pwdPreview.value = null;
	}

	if (type === "ip" && ipPreview.value) {
		URL.revokeObjectURL(ipPreview.value);
		ipPreview.value = null;
	}

	if (type === "4ps" && fourPsPreview.value) {
		URL.revokeObjectURL(fourPsPreview.value);
		fourPsPreview.value = null;
	}
}

function clearFile(type: DocumentType) {
	clearPreview(type);

	if (type === "pwd") {
		formStore.other.pwdFile = null;

		if (pwdInput.value) {
			pwdInput.value.value = "";
		}
	}

	if (type === "ip") {
		formStore.other.ipFile = null;

		if (ipInput.value) {
			ipInput.value.value = "";
		}
	}

	if (type === "4ps") {
		formStore.other.fourPsFile = null;

		if (fourPsInput.value) {
			fourPsInput.value.value = "";
		}
	}
}

function handleSelection(value: string, type: DocumentType) {
	if (type === "pwd") {
		formStore.other.disability = value;
	}

	if (type === "ip") {
		formStore.other.indigenous = value;
	}

	if (type === "4ps") {
		formStore.other.fourPs = value;
	}

	if (value !== "Yes") {
		clearFile(type);
	}
}

function handleFile(event: Event, type: DocumentType) {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];

	if (!file) return;

	if (!ALLOWED_FILE_TYPES.includes(file.type)) {
		toast.add({
			title: "Invalid File Type",
			description: "Only PDF, JPG, and PNG files are allowed.",
			color: "error",
		});

		clearFile(type);
		return;
	}

	if (file.size > MAX_FILE_SIZE) {
		toast.add({
			title: "File Too Large",
			description: "The maximum allowed file size is 5 MB.",
			color: "error",
		});

		clearFile(type);
		return;
	}

	clearPreview(type);

	const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;

	if (type === "pwd") {
		formStore.other.pwdFile = file;
		pwdPreview.value = preview;
	}

	if (type === "ip") {
		formStore.other.ipFile = file;
		ipPreview.value = preview;
	}

	if (type === "4ps") {
		formStore.other.fourPsFile = file;
		fourPsPreview.value = preview;
	}

	toast.add({
		title: "File Selected",
		description: `${file.name} is ready for upload.`,
		color: "success",
	});
}

onBeforeUnmount(() => {
	clearPreview("pwd");
	clearPreview("ip");
	clearPreview("4ps");
});
</script>

<template>
	<div class="space-y-8">
		<!-- PWD -->
		<div class="space-y-3">
			<UFormField label="Person With Disability (PWD)">
				<USelect
					:model-value="formStore.other.disability"
					:items="YES_NO_OPTIONS"
					icon="i-lucide-accessibility"
					placeholder="Select Yes or No"
					class="w-full"
					@update:model-value="(value) => handleSelection(value, 'pwd')"
				/>
			</UFormField>

			<div
				v-if="formStore.other.disability === 'Yes'"
				class="space-y-3"
			>
				<UButton
					type="button"
					icon="i-lucide-upload"
					variant="outline"
					class="w-full sm:w-auto"
					@click="pwdInput?.click()"
				>
					Upload PWD ID
				</UButton>

				<input
					ref="pwdInput"
					type="file"
					accept=".pdf,.jpg,.jpeg,.png"
					class="hidden"
					@change="(e) => handleFile(e, 'pwd')"
				/>

				<div
					v-if="formStore.other.pwdFile"
					class="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
				>
					<div class="flex items-center justify-between gap-3">
						<div class="flex min-w-0 items-center gap-2">
							<UIcon
								name="i-lucide-file-check"
								class="size-5 text-emerald-600"
							/>

							<span class="truncate text-sm">
								{{ formStore.other.pwdFile.name }}
							</span>
						</div>

						<UButton
							type="button"
							icon="i-lucide-x"
							color="error"
							variant="ghost"
							size="sm"
							@click="clearFile('pwd')"
						/>
					</div>

					<img
						v-if="pwdPreview"
						:src="pwdPreview"
						alt="PWD document preview"
						class="mt-3 max-h-40 rounded-lg border object-contain"
					/>
				</div>
			</div>
		</div>

		<!-- IP -->
		<div class="space-y-3">
			<UFormField label="Indigenous People (IP)">
				<USelect
					:model-value="formStore.other.indigenous"
					:items="YES_NO_OPTIONS"
					icon="i-lucide-users"
					placeholder="Select Yes or No"
					class="w-full"
					@update:model-value="(value) => handleSelection(value, 'ip')"
				/>
			</UFormField>

			<div
				v-if="formStore.other.indigenous === 'Yes'"
				class="space-y-3"
			>
				<UButton
					type="button"
					icon="i-lucide-upload"
					variant="outline"
					class="w-full sm:w-auto"
					@click="ipInput?.click()"
				>
					Upload Indigenous Proof
				</UButton>

				<input
					ref="ipInput"
					type="file"
					accept=".pdf,.jpg,.jpeg,.png"
					class="hidden"
					@change="(e) => handleFile(e, 'ip')"
				/>

				<div
					v-if="formStore.other.ipFile"
					class="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
				>
					<div class="flex items-center justify-between gap-3">
						<div class="flex min-w-0 items-center gap-2">
							<UIcon
								name="i-lucide-file-check"
								class="size-5 text-emerald-600"
							/>

							<span class="truncate text-sm">
								{{ formStore.other.ipFile.name }}
							</span>
						</div>

						<UButton
							type="button"
							icon="i-lucide-x"
							color="error"
							variant="ghost"
							size="sm"
							@click="clearFile('ip')"
						/>
					</div>

					<img
						v-if="ipPreview"
						:src="ipPreview"
						alt="Indigenous proof preview"
						class="mt-3 max-h-40 rounded-lg border object-contain"
					/>
				</div>
			</div>
		</div>

		<!-- 4PS -->
		<div class="space-y-3">
			<UFormField label="4Ps Beneficiary">
				<USelect
					:model-value="formStore.other.fourPs"
					:items="YES_NO_OPTIONS"
					icon="i-lucide-heart-handshake"
					placeholder="Select Yes or No"
					class="w-full"
					@update:model-value="(value) => handleSelection(value, '4ps')"
				/>
			</UFormField>

			<div
				v-if="formStore.other.fourPs === 'Yes'"
				class="space-y-3"
			>
				<UButton
					type="button"
					icon="i-lucide-upload"
					variant="outline"
					class="w-full sm:w-auto"
					@click="fourPsInput?.click()"
				>
					Upload 4Ps Proof
				</UButton>

				<input
					ref="fourPsInput"
					type="file"
					accept=".pdf,.jpg,.jpeg,.png"
					class="hidden"
					@change="(e) => handleFile(e, '4ps')"
				/>

				<div
					v-if="formStore.other.fourPsFile"
					class="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
				>
					<div class="flex items-center justify-between gap-3">
						<div class="flex min-w-0 items-center gap-2">
							<UIcon
								name="i-lucide-file-check"
								class="size-5 text-emerald-600"
							/>

							<span class="truncate text-sm">
								{{ formStore.other.fourPsFile.name }}
							</span>
						</div>

						<UButton
							type="button"
							icon="i-lucide-x"
							color="error"
							variant="ghost"
							size="sm"
							@click="clearFile('4ps')"
						/>
					</div>

					<img
						v-if="fourPsPreview"
						:src="fourPsPreview"
						alt="4Ps proof preview"
						class="mt-3 max-h-40 rounded-lg border object-contain"
					/>
				</div>
			</div>
		</div>

		<p class="text-xs text-slate-500 dark:text-slate-400">
			Accepted formats: PDF, JPG, PNG. Maximum file size: 5 MB per document. Proof documents are
			required when you select Yes.
		</p>
	</div>
</template>
