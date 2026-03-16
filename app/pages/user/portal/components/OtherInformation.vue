<script setup lang="ts">
import { ref } from "vue";

const model = defineModel<any>();

const yesNoOptions = [
	{ label: "Yes", value: "Yes" },
	{ label: "No", value: "No" },
];

const pwdFile = ref<File | null>(null);
const pwdPreview = ref<string | null>(null);

const ipFile = ref<File | null>(null);
const ipPreview = ref<string | null>(null);

const fourPsFile = ref<File | null>(null);
const fourPsPreview = ref<string | null>(null);

function handleFile(event: Event, type: string) {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (!file) return;

	const isImage = file.type.startsWith("image/");

	if (type === "pwd") {
		pwdFile.value = file;
		pwdPreview.value = isImage ? URL.createObjectURL(file) : null;
	}
	if (type === "ip") {
		ipFile.value = file;
		ipPreview.value = isImage ? URL.createObjectURL(file) : null;
	}
	if (type === "4ps") {
		fourPsFile.value = file;
		fourPsPreview.value = isImage ? URL.createObjectURL(file) : null;
	}
}
</script>

<template>
	<div>
		<h2 class="text-lg md:text-xl font-semibold mb-4">Other Information</h2>

		<!-- Responsive grid for selects -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<UFormField label="Person With Disability (PWD)">
				<USelect
					v-model="model.disability"
					:options="yesNoOptions"
					option-attribute="label"
					value-attribute="value"
					placeholder="Select Yes or No"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Indigenous People (IP)">
				<USelect
					v-model="model.indigenous"
					:options="yesNoOptions"
					option-attribute="label"
					value-attribute="value"
					placeholder="Select Yes or No"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="4Ps Beneficiary">
				<USelect
					v-model="model.fourPs"
					:options="yesNoOptions"
					option-attribute="label"
					value-attribute="value"
					placeholder="Select Yes or No"
					class="w-full"
				/>
			</UFormField>
		</div>

		<!-- File Uploads (Always Visible, Optional) -->
		<div class="space-y-5 mt-6">
			<UFormField label="Upload PWD ID / Evidence (Optional)">
				<label class="upload-box">
					<input
						type="file"
						accept="image/*,.pdf"
						class="hidden"
						@change="(e) => handleFile(e, 'pwd')"
					/>
					<div class="upload-content">
						<div class="upload-icon">⬆</div>
						<p class="upload-title">Tap to upload PWD proof</p>
						<p class="upload-sub">Image or PDF</p>
					</div>
				</label>

				<div
					v-if="pwdFile"
					class="file-success"
				>
					✔ {{ pwdFile.name }}
				</div>
				<img
					v-if="pwdPreview"
					:src="pwdPreview"
					class="mt-2 max-h-40 rounded"
					alt="PWD Preview"
				/>
			</UFormField>

			<UFormField label="Upload Indigenous Proof (Optional)">
				<label class="upload-box">
					<input
						type="file"
						accept="image/*,.pdf"
						class="hidden"
						@change="(e) => handleFile(e, 'ip')"
					/>
					<div class="upload-content">
						<div class="upload-icon">⬆</div>
						<p class="upload-title">Tap to upload IP Certificate</p>
						<p class="upload-sub">Image or PDF</p>
					</div>
				</label>

				<div
					v-if="ipFile"
					class="file-success"
				>
					✔ {{ ipFile.name }}
				</div>
				<img
					v-if="ipPreview"
					:src="ipPreview"
					class="mt-2 max-h-40 rounded"
					alt="IP Preview"
				/>
			</UFormField>

			<UFormField label="Upload 4Ps Proof (Optional)">
				<label class="upload-box">
					<input
						type="file"
						accept="image/*,.pdf"
						class="hidden"
						@change="(e) => handleFile(e, '4ps')"
					/>
					<div class="upload-content">
						<div class="upload-icon">⬆</div>
						<p class="upload-title">Tap to upload 4Ps ID</p>
						<p class="upload-sub">Image or PDF</p>
					</div>
				</label>

				<div
					v-if="fourPsFile"
					class="file-success"
				>
					✔ {{ fourPsFile.name }}
				</div>
				<img
					v-if="fourPsPreview"
					:src="fourPsPreview"
					class="mt-2 max-h-40 rounded"
					alt="4Ps Preview"
				/>
			</UFormField>
		</div>
	</div>
</template>

<style scoped>
.upload-box {
	border: 2px dashed #d1d5db;
	border-radius: 10px;
	padding: 20px;
	display: block;
	cursor: pointer;
	transition: all 0.2s;
}

.upload-box:hover {
	background: #f9fafb;
}

.upload-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
}

.upload-icon {
	font-size: 22px;
	margin-bottom: 6px;
}

.upload-title {
	font-size: 14px;
	font-weight: 500;
}

.upload-sub {
	font-size: 12px;
	color: #6b7280;
}

.file-success {
	font-size: 12px;
	color: #16a34a;
	margin-top: 6px;
}
</style>
