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
	<div class="space-y-8">
		<!-- PWD -->
		<div class="space-y-3">
			<UFormField label="Person With Disability (PWD)">
				<USelect
					v-model="formStore.other.disability"
					:items="YES_NO_OPTIONS"
					icon="i-lucide-eye"
					placeholder="Select Yes or No"
					class="w-full"
				/>
			</UFormField>

			<div
				v-if="formStore.other.disability === 'Yes'"
				class="space-y-3"
			>
				<UButton
					icon="i-lucide-upload"
					class="w-full sm:w-auto"
					@click="pwdInput?.click()"
				>
					Upload PWD ID
				</UButton>

				<input
					ref="pwdInput"
					type="file"
					class="hidden"
					@change="(e) => handleFile(e, 'pwd')"
				/>

				<p
					v-if="formStore.other.pwdFile"
					class="text-sm text-slate-500"
				>
					{{ formStore.other.pwdFile.name }}
				</p>

				<img
					v-if="pwdPreview"
					:src="pwdPreview"
					class="max-h-40 rounded-lg border"
				/>
			</div>
		</div>

		<!-- IP -->
		<div class="space-y-3">
			<UFormField label="Indigenous People (IP)">
				<USelect
					v-model="formStore.other.indigenous"
					:items="YES_NO_OPTIONS"
					icon="i-lucide-users"
					placeholder="Select Yes or No"
					class="w-full"
				/>
			</UFormField>

			<div
				v-if="formStore.other.indigenous === 'Yes'"
				class="space-y-3"
			>
				<UButton
					icon="i-lucide-upload"
					class="w-full sm:w-auto"
					@click="ipInput?.click()"
				>
					Upload Indigenous Proof
				</UButton>

				<input
					ref="ipInput"
					type="file"
					class="hidden"
					@change="(e) => handleFile(e, 'ip')"
				/>

				<p
					v-if="formStore.other.ipFile"
					class="text-sm text-slate-500"
				>
					{{ formStore.other.ipFile.name }}
				</p>

				<img
					v-if="ipPreview"
					:src="ipPreview"
					class="max-h-40 rounded-lg border"
				/>
			</div>
		</div>

		<!-- 4PS -->
		<div class="space-y-3">
			<UFormField label="4Ps Beneficiary">
				<USelect
					v-model="formStore.other.fourPs"
					:items="YES_NO_OPTIONS"
					icon="i-lucide-heart-handshake"
					placeholder="Select Yes or No"
					class="w-full"
				/>
			</UFormField>

			<div
				v-if="formStore.other.fourPs === 'Yes'"
				class="space-y-3"
			>
				<UButton
					icon="i-lucide-upload"
					class="w-full sm:w-auto"
					@click="fourPsInput?.click()"
				>
					Upload 4Ps Proof
				</UButton>

				<input
					ref="fourPsInput"
					type="file"
					class="hidden"
					@change="(e) => handleFile(e, '4ps')"
				/>

				<p
					v-if="formStore.other.fourPsFile"
					class="text-sm text-slate-500"
				>
					{{ formStore.other.fourPsFile.name }}
				</p>

				<img
					v-if="fourPsPreview"
					:src="fourPsPreview"
					class="max-h-40 rounded-lg border"
				/>
			</div>
		</div>
	</div>
</template>
