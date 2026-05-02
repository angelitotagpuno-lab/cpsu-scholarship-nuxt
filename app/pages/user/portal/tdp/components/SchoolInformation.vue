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

const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];

	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};
</script>

<template>
	<div class="space-y-6">
		<UForm
			:state="formStore.school"
			class="space-y-5"
		>
			<!-- STACKED FIELDS (ONLY THESE TWO) -->
			<div class="space-y-4">
				<UFormField
					name="schoolName"
					label="School Name"
					:rules="[isRequired, isName]"
					validate-on="input"
				>
					<UInput
						v-model="formStore.school.schoolName"
						icon="i-lucide-building"
						placeholder="Central Mindanao University"
						class="w-full"
						@keydown="allowLetters"
					/>
				</UFormField>

				<UFormField label="School Address">
					<UInput
						v-model="formStore.school.schoolAddress"
						icon="i-lucide-map-pin"
						placeholder="Brgy. San Jose, San Carlos City"
						class="w-full"
					/>
				</UFormField>
			</div>

			<!-- GRID FIELDS -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<UFormField
					name="schoolId"
					label="School ID"
					:rules="[isRequired, isNumber]"
					validate-on="input"
				>
					<UInput
						v-model="formStore.school.schoolId"
						icon="i-lucide-id-card"
						placeholder="123456"
						class="w-full"
						@keydown="allowNumbers"
					/>
				</UFormField>

				<UFormField label="School Sector">
					<USelect
						v-model="formStore.school.schoolSector"
						:items="SECTOR_OPTIONS"
						icon="i-lucide-building-2"
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
						icon="i-lucide-hash"
						placeholder="2"
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
						icon="i-lucide-book-open"
						placeholder="BS Information Technology"
						class="w-full"
						@keydown="allowLetters"
					/>
				</UFormField>
			</div>
		</UForm>
	</div>
</template>
