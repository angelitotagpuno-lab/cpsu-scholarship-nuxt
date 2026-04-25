<script setup lang="ts">
import { useTdpScholarFormStore } from "~/stores/TdpScholarForm.store";

const formStore = useTdpScholarFormStore();
const SECTOR_OPTIONS = ["Public", "Private"];

const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Space"];

	if (!/[A-Za-z\s]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};

// STRICT NUMBERS ONLY
const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];

	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};
</script>

<template>
	<div class="space-y-6">
		<h3 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">
			School Information
		</h3>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<UFormField
				name="schoolName"
				label="School Name"
				class="md:col-span-2"
				:rules="[isRequired, isName]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.school.schoolName"
					placeholder="Ex: Central Mindanao University"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<UFormField
				name="schoolId"
				label="School ID"
				:rules="[isRequired, isNumber]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.school.schoolId"
					placeholder="Ex: 123456"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<UFormField
				label="School Address"
				class="md:col-span-2"
			>
				<UInput
					v-model="formStore.school.schoolAddress"
					placeholder="Ex: Brgy. San Jose, San Carlos City"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="School Sector">
				<USelect
					v-model="formStore.school.schoolSector"
					:items="SECTOR_OPTIONS"
					placeholder="Select Sector"
					class="w-full"
				/>
			</UFormField>

			<UFormField
				name="yearLevel"
				label="Year Level"
				:rules="[isRequired, isNumber]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.school.yearLevel"
					placeholder="Ex: 2"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<UFormField
				label="Course"
				:rules="[isRequired, isName]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.school.course"
					placeholder="Ex: BS Information Technology"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>
		</div>
	</div>
</template>
