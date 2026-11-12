<script setup lang="ts">
import { useApplicationStore } from "~/stores/application.store";
import { isRequired, isName, isNumber } from "~/utils/validators";

const store = useApplicationStore();

const SEX_OPTIONS = [
	{ label: "Male", value: "male" },
	{ label: "Female", value: "female" },
];

const YEAR_LEVELS = [
	{ label: "1", value: "1" },
	{ label: "2", value: "2" },
	{ label: "3", value: "3" },
	{ label: "4", value: "4" },
];

// LETTER ONLY
const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", " "];
	if (!/[A-Za-z\s]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};

// NUMBER ONLY
const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};

/* =========================
   FILE HANDLER (UNCHANGED)
========================= */
function onFileChange(e: Event) {
	const target = e.target as HTMLInputElement;
	const file = target.files?.[0] || null;
	store.item.documentFile = file;
}
</script>

<template>
	<UForm class="space-y-6">
		<!-- GRID FORM -->
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<!-- STUDENT ID -->
			<UFormField label="Student ID">
				<UInput
					v-model="store.item.studentId"
					icon="i-lucide-id-card"
					placeholder="Enter Student ID"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<!-- LAST NAME -->
			<UFormField label="Last Name">
				<UInput
					v-model="store.item.profile.lastName"
					icon="i-lucide-user"
					placeholder="Enter Last Name"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- FIRST NAME -->
			<UFormField label="First Name">
				<UInput
					v-model="store.item.profile.firstName"
					icon="i-lucide-user-round"
					placeholder="Enter First Name"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- SEX -->
			<UFormField label="Sex">
				<USelect
					v-model="store.item.profile.sex"
					icon="i-lucide-user"
					:items="SEX_OPTIONS"
					option-attribute="label"
					value-attribute="value"
					placeholder="Select Sex"
					class="w-full"
				/>
			</UFormField>

			<!-- BIRTHDATE -->
			<UFormField label="Birthdate">
				<UInput
					v-model="store.item.profile.birthdate"
					type="date"
					icon="i-lucide-calendar"
					class="w-full"
					placeholder="Select Birthdate"
				/>
			</UFormField>

			<!-- BIRTHPLACE -->
			<UFormField label="Place of Birth">
				<UInput
					v-model="store.item.profile.birthplace"
					icon="i-lucide-map-pin"
					placeholder="Enter Place of Birth"
					class="w-full"
				/>
			</UFormField>

			<!-- CONTACT -->
			<UFormField label="Contact Number">
				<UInput
					v-model="store.item.profile.contactNumber"
					icon="i-lucide-phone"
					placeholder="09XXXXXXXXX"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<!-- YEAR LEVEL -->
			<UFormField label="Year Level">
				<USelect
					v-model="store.item.profile.yearLevel"
					icon="i-lucide-graduation-cap"
					:items="YEAR_LEVELS"
					option-attribute="label"
					value-attribute="value"
					placeholder="Select Year Level"
					class="w-full"
				/>
			</UFormField>

			<!-- COURSE ID -->
			<UFormField label="Course ID">
				<UInput
					v-model="store.item.profile.courseId"
					icon="i-lucide-book-open"
					placeholder="Enter Course ID"
					class="w-full"
				/>
			</UFormField>

			<!-- FILE UPLOAD -->
			<UFormField
				label="Certificate of Registration"
				class="sm:col-span-2 md:col-span-3"
			>
				<input
					type="file"
					accept="application/pdf,image/jpeg"
					class="block w-full border rounded p-2"
					@change="onFileChange"
				/>

				<p
					v-if="store.item.documentFile"
					class="text-sm text-gray-500 mt-1"
				>
					Selected: {{ store.item.documentFile.name }}
				</p>
			</UFormField>
		</div>
	</UForm>
</template>
