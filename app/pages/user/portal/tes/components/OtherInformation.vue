<script setup lang="ts">
import { ref } from "vue";
import { useTesScholarFormStore } from "~/stores/TesScholarForm.store";

const formStore = useTesScholarFormStore();

const YES_NO_OPTIONS = ["Yes", "No"];

const pwdPreview = ref<string | null>(null);
const ipPreview = ref<string | null>(null);
const fourPsPreview = ref<string | null>(null);

// ✅ FIXED REFS (NO $refs)
const pwdInput = ref<HTMLInputElement | null>(null);
const ipInput = ref<HTMLInputElement | null>(null);
const fourPsInput = ref<HTMLInputElement | null>(null);

function handleFile(event: Event, type: "pwd" | "ip" | "4ps") {
	const file = (event.target as HTMLInputElement).files?.[0] || null;
	if (!file) return;

	if (type === "pwd") {
		formStore.other.pwdFile = file;
		pwdPreview.value = URL.createObjectURL(file);
	}

	if (type === "ip") {
		formStore.other.ipFile = file;
		ipPreview.value = URL.createObjectURL(file);
	}

	if (type === "4ps") {
		formStore.other.fourPsFile = file;
		fourPsPreview.value = URL.createObjectURL(file);
	}
}
</script>

<template>
	<div class="space-y-6">
		<h2 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">
			Other Information
		</h2>

		<div class="flex flex-col gap-4">
			<!-- PWD -->
			<UFormField label="Person With Disability (PWD)">
				<USelect
					v-model="formStore.other.disability"
					:items="YES_NO_OPTIONS"
					placeholder="Select Yes or No"
					class="w-full"
				/>
			</UFormField>

			<!-- PWD UPLOAD -->
			<div
				v-if="formStore.other.disability === 'Yes'"
				class="space-y-2"
			>
				<button
					type="button"
					class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md w-full sm:w-auto"
					@click="pwdInput?.click()"
				>
					Upload PWD ID
				</button>

				<input
					ref="pwdInput"
					type="file"
					class="hidden"
					@change="(e) => handleFile(e, 'pwd')"
				/>

				<p
					v-if="formStore.other.pwdFile"
					class="text-sm"
				>
					{{ formStore.other.pwdFile.name }}
				</p>

				<img
					v-if="pwdPreview"
					:src="pwdPreview"
					class="max-h-40 rounded"
				/>
			</div>

			<!-- INDIGENOUS -->
			<UFormField label="Indigenous People (IP)">
				<USelect
					v-model="formStore.other.indigenous"
					:items="YES_NO_OPTIONS"
					placeholder="Select Yes or No"
					class="w-full"
				/>
			</UFormField>

			<!-- IP UPLOAD -->
			<div
				v-if="formStore.other.indigenous === 'Yes'"
				class="space-y-2"
			>
				<button
					type="button"
					class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md w-full sm:w-auto"
					@click="ipInput?.click()"
				>
					Upload Indigenous Proof
				</button>

				<input
					ref="ipInput"
					type="file"
					class="hidden"
					@change="(e) => handleFile(e, 'ip')"
				/>

				<p
					v-if="formStore.other.ipFile"
					class="text-sm"
				>
					{{ formStore.other.ipFile.name }}
				</p>

				<img
					v-if="ipPreview"
					:src="ipPreview"
					class="max-h-40 rounded"
				/>
			</div>

			<!-- 4PS -->
			<UFormField label="4Ps Beneficiary">
				<USelect
					v-model="formStore.other.fourPs"
					:items="YES_NO_OPTIONS"
					placeholder="Select Yes or No"
					class="w-full"
				/>
			</UFormField>

			<!-- 4PS UPLOAD -->
			<div
				v-if="formStore.other.fourPs === 'Yes'"
				class="space-y-2"
			>
				<button
					type="button"
					class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md w-full sm:w-auto"
					@click="fourPsInput?.click()"
				>
					Upload 4Ps Proof
				</button>

				<input
					ref="fourPsInput"
					type="file"
					class="hidden"
					@change="(e) => handleFile(e, '4ps')"
				/>

				<p
					v-if="formStore.other.fourPsFile"
					class="text-sm"
				>
					{{ formStore.other.fourPsFile.name }}
				</p>

				<img
					v-if="fourPsPreview"
					:src="fourPsPreview"
					class="max-h-40 rounded"
				/>
			</div>
		</div>
	</div>
</template>
