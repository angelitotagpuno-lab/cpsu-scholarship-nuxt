<script setup lang="ts">
import { ref } from "vue";
import { useTesScholarFormStore } from "~/stores/TesScholarForm.store";

const formStore = useTesScholarFormStore();

const yesNoOptions = [
	{ label: "Yes", value: "Yes" },
	{ label: "No", value: "No" },
];

const pwdPreview = ref<string | null>(null);
const ipPreview = ref<string | null>(null);
const fourPsPreview = ref<string | null>(null);

function handleFile(event: Event, type: "pwd" | "ip" | "4ps") {
	const file = (event.target as HTMLInputElement).files?.[0] || null;
	if (!file) return;

	if (type === "pwd") {
		formStore.other.pwdFile = file;
		pwdPreview.value = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
	}
	if (type === "ip") {
		formStore.other.ipFile = file;
		ipPreview.value = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
	}
	if (type === "4ps") {
		formStore.other.fourPsFile = file;
		fourPsPreview.value = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
	}
}
</script>

<template>
	<div class="space-y-6">
		<h2 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">
			Other Information
		</h2>

		<!-- Selects -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
			<UFormField label="Person With Disability (PWD)">
				<USelect
					v-model="formStore.other.disability"
					:options="yesNoOptions"
					placeholder="Select Yes or No"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Indigenous People (IP)">
				<USelect
					v-model="formStore.other.indigenous"
					:options="yesNoOptions"
					placeholder="Select Yes or No"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="4Ps Beneficiary">
				<USelect
					v-model="formStore.other.fourPs"
					:options="yesNoOptions"
					placeholder="Select Yes or No"
					class="w-full"
				/>
			</UFormField>
		</div>

		<!-- File Uploads as buttons -->
		<UFormField label="Upload PWD ID / Evidence (Optional)">
			<div class="flex flex-col gap-2">
				<button
					type="button"
					class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md w-full sm:w-auto max-w-xs"
					@click="$refs.pwdInput.click()"
				>
					Upload PWD ID
				</button>
				<input
					type="file"
					ref="pwdInput"
					class="hidden"
					@change="(e) => handleFile(e, 'pwd')"
				/>
				<div
					v-if="formStore.other.pwdFile"
					class="text-sm text-gray-700 dark:text-gray-300"
				>
					{{ formStore.other.pwdFile.name }}
				</div>
				<img
					v-if="pwdPreview"
					:src="pwdPreview"
					class="max-h-40 mt-2 rounded"
				/>
			</div>
		</UFormField>

		<UFormField label="Upload Indigenous Proof (Optional)">
			<div class="flex flex-col gap-2">
				<button
					type="button"
					class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md w-full sm:w-auto max-w-xs"
					@click="$refs.ipInput.click()"
				>
					Upload Indigenous Proof
				</button>
				<input
					ref="ipInput"
					type="file"
					class="hidden"
					@change="(e) => handleFile(e, 'ip')"
				/>
				<div
					v-if="formStore.other.ipFile"
					class="text-sm text-gray-700 dark:text-gray-300"
				>
					{{ formStore.other.ipFile.name }}
				</div>
				<img
					v-if="ipPreview"
					:src="ipPreview"
					class="max-h-40 mt-2 rounded"
				/>
			</div>
		</UFormField>

		<UFormField label="Upload 4Ps Proof (Optional)">
			<div class="flex flex-col gap-2">
				<button
					type="button"
					class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md w-full sm:w-auto max-w-xs"
					@click="$refs.fourPsInput.click()"
				>
					Upload 4Ps Proof
				</button>
				<input
					ref="fourPsInput"
					type="file"
					class="hidden"
					@change="(e) => handleFile(e, '4ps')"
				/>
				<div
					v-if="formStore.other.fourPsFile"
					class="text-sm text-gray-700 dark:text-gray-300"
				>
					{{ formStore.other.fourPsFile.name }}
				</div>
				<img
					v-if="fourPsPreview"
					:src="fourPsPreview"
					class="max-h-40 mt-2 rounded"
				/>
			</div>
		</UFormField>
	</div>
</template>
