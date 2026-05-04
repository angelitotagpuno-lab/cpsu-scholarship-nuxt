<script setup lang="ts">
import { useApplicationStore } from "~/stores/application.store";
import { isRequired, isName, isNumber } from "~/utils/validators";

const store = useApplicationStore();

const SEX_OPTIONS = ["Male", "Female"];

const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", " "];
	if (!/[A-Za-z\s]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
};

const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
};

/* =========================
   FILE HANDLER (PINIA)
========================= */
function onFileChange(e: Event) {
	const target = e.target as HTMLInputElement;
	const file = target.files?.[0] || null;

	// ✅ store directly in Pinia
	store.item.documentFile = file;
}
</script>

<template>
	<div class="space-y-6">
		<!-- STUDENT ID -->
		<UFormField
			label="Student ID"
			:rules="[isRequired]"
		>
			<UInput v-model="store.item.studentId" />
		</UFormField>

		<!-- HEADER -->
		<div class="flex items-center gap-2">
			<UIcon
				name="i-lucide-user-round"
				class="text-emerald-600 size-5"
			/>
			<h2 class="text-lg font-semibold">Student Information</h2>
		</div>

		<!-- FORM -->
		<UForm
			:state="store.item.profile"
			class="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full"
		>
			<UFormField
				label="Last Name"
				:rules="[isRequired, isName]"
			>
				<UInput
					v-model="store.item.profile.lastName"
					@keydown="allowLetters"
				/>
			</UFormField>

			<UFormField
				label="First Name"
				:rules="[isRequired, isName]"
			>
				<UInput
					v-model="store.item.profile.firstName"
					@keydown="allowLetters"
				/>
			</UFormField>

			<UFormField
				label="Sex"
				:rules="[isRequired]"
			>
				<USelect
					v-model="store.item.profile.sex"
					:items="SEX_OPTIONS"
				/>
			</UFormField>

			<UFormField
				label="Birthdate"
				:rules="[isRequired]"
			>
				<UInput
					v-model="store.item.profile.birthdate"
					type="date"
				/>
			</UFormField>

			<UFormField
				label="Place of Birth"
				:rules="[isRequired]"
			>
				<UInput v-model="store.item.profile.birthplace" />
			</UFormField>

			<UFormField
				label="Contact Number"
				:rules="[isRequired, isNumber]"
			>
				<UInput
					v-model="store.item.profile.contactNumber"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<UFormField
				label="Year Level"
				:rules="[isRequired]"
			>
				<USelect
					v-model="store.item.profile.yearLevel"
					:items="['1', '2', '3', '4']"
				/>
			</UFormField>

			<!-- DOCUMENT UPLOAD (PINIA) -->
			<UFormField label="Certificate of Registration (PDF/JPG)">
				<input
					type="file"
					accept="application/pdf,image/jpeg"
					@change="onFileChange"
				/>

				<!-- optional: show selected file -->
				<p
					v-if="store.item.documentFile"
					class="text-sm text-gray-500 mt-1"
				>
					Selected: {{ store.item.documentFile.name }}
				</p>
			</UFormField>
		</UForm>
	</div>
</template>
