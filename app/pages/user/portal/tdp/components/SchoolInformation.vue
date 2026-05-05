<script setup lang="ts">
import { useApplicationStore } from "~/stores/application.store";

const store = useApplicationStore();

const SECTOR_OPTIONS = [
	{ label: "Public", value: "Public" },
	{ label: "Private", value: "Private" },
];

const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", " "];
	if (!/[A-Za-z\s]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
};
</script>

<template>
	<UForm class="space-y-6">
		<!-- HEADER -->
		<div class="flex items-center gap-2">
			<UIcon
				name="i-lucide-graduation-cap"
				class="text-emerald-600 size-5"
			/>
			<h2 class="text-lg font-semibold">School Information</h2>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- SCHOOL NAME (FULL WIDTH) -->
			<UFormField
				label="School Name"
				class="md:col-span-3"
			>
				<UInput
					v-model="store.item.profile.school.schoolName"
					icon="i-lucide-building-2"
					placeholder="Enter school name"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- SCHOOL ADDRESS (FULL WIDTH) -->
			<UFormField
				label="School Address"
				class="md:col-span-3"
			>
				<UInput
					v-model="store.item.profile.school.schoolAddress"
					icon="i-lucide-map-pin"
					placeholder="Enter school address"
					class="w-full"
				/>
			</UFormField>

			<!-- SCHOOL ID -->
			<UFormField label="School ID">
				<UInput
					v-model="store.item.profile.school.schoolId"
					icon="i-lucide-id-card"
					placeholder="e.g. 2024-001-ABC"
					class="w-full"
				/>
			</UFormField>

			<!-- SCHOOL SECTOR -->
			<UFormField label="School Sector">
				<USelect
					v-model="store.item.profile.school.schoolSector"
					:items="SECTOR_OPTIONS"
					option-attribute="label"
					value-attribute="value"
					placeholder="Select sector"
					icon="i-lucide-building"
					class="w-full"
				/>
			</UFormField>

			<!-- COURSE -->
			<UFormField label="Course">
				<UInput
					v-model="store.item.profile.courseId"
					icon="i-lucide-book-open"
					placeholder="Enter course"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>
		</div>
	</UForm>
</template>
