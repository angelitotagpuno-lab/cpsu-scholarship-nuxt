<script setup lang="ts">
import { useApplicationStore } from "~/stores/application.store";
import { isRequired } from "~/utils/validators";

const store = useApplicationStore();

const SECTOR_OPTIONS = ["Public", "Private"];

const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", " "];
	if (!/[A-Za-z\s]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
};

const isSchoolId = (value: string) => {
	return /^[0-9A-Za-z-]+$/.test(value);
};
</script>

<template>
	<UForm class="space-y-5">
		<!-- SCHOOL NAME -->
		<UFormField label="School Name">
			<UInput
				v-model="store.item.profile.school.schoolName"
				@keydown="allowLetters"
			/>
		</UFormField>

		<!-- SCHOOL ADDRESS -->
		<UFormField label="School Address">
			<UInput v-model="store.item.profile.school.schoolAddress" />
		</UFormField>

		<!-- SCHOOL ID -->
		<UFormField
			label="School ID"
			:rules="[isRequired, isSchoolId]"
		>
			<UInput
				v-model="store.item.profile.school.schoolId"
				placeholder="e.g. 2024-001-ABC"
			/>
		</UFormField>

		<!-- SCHOOL SECTOR -->
		<UFormField label="School Sector">
			<USelect
				v-model="store.item.profile.school.schoolSector"
				:items="SECTOR_OPTIONS"
			/>
		</UFormField>

		<!-- YEAR LEVEL (PINIA DIRECT) -->
		<UFormField
			label="Year Level"
			:rules="[isRequired]"
		>
			<USelect
				v-model="store.item.profile.yearLevel"
				:items="['1', '2', '3', '4']"
			/>
		</UFormField>

		<!-- COURSE (PINIA DIRECT) -->
		<UFormField label="Course">
			<UInput
				v-model="store.item.profile.courseId"
				@keydown="allowLetters"
			/>
		</UFormField>
	</UForm>
</template>
