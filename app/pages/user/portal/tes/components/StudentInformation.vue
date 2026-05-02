<script setup lang="ts">
import { useTesScholarFormStore } from "~/stores/TesScholarForm.store";

const formStore = useTesScholarFormStore();

const SEX_OPTIONS = ["Male", "Female"];
const YEAR_OPTIONS = ["1", "2", "3", "4"];

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
</script>

<template>
	<UForm class="space-y-6">
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<!-- STUDENT ID (HALF STACK) -->
			<UFormField
				label="Student ID"
				class="sm:col-span-1"
			>
				<UInput
					v-model="formStore.student.studentId"
					icon="i-lucide-id-card"
					placeholder="Student ID"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<!-- STUDENT GRADE -->
			<UFormField
				label="Student Grade"
				class="sm:col-span-1"
			>
				<UInput
					v-model="formStore.student.studentGrade"
					icon="i-lucide-bar-chart-3"
					placeholder="Ex: 85 / A / 2.5"
					class="w-full"
				/>
			</UFormField>

			<!-- SEX -->
			<UFormField label="Sex">
				<USelect
					v-model="formStore.student.sex"
					icon="i-lucide-user"
					:items="SEX_OPTIONS"
					placeholder="Select Sex"
					class="w-full"
				/>
			</UFormField>

			<!-- YEAR LEVEL -->
			<UFormField label="Year Level">
				<USelect
					v-model="formStore.student.yearLevel"
					icon="i-lucide-cog"
					:items="YEAR_OPTIONS"
					placeholder="Select Year"
					class="w-full"
				/>
			</UFormField>

			<!-- LAST NAME -->
			<UFormField label="Last Name">
				<UInput
					v-model="formStore.student.lastName"
					icon="i-lucide-user"
					placeholder="Dela Cruz"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- FIRST NAME -->
			<UFormField label="First Name">
				<UInput
					v-model="formStore.student.firstName"
					icon="i-lucide-user-round"
					placeholder="Juan"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- MIDDLE NAME -->
			<UFormField label="Middle Name">
				<UInput
					v-model="formStore.student.middleName"
					icon="i-lucide-user"
					placeholder="Delapena"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- EXTENSION -->
			<UFormField label="Extension">
				<UInput
					v-model="formStore.student.extName"
					icon="i-lucide-award"
					placeholder="Jr, Sr, III"
					class="w-full"
				/>
			</UFormField>

			<!-- BIRTHDATE -->
			<UFormField label="Birthdate">
				<UInput
					v-model="formStore.student.birthdate"
					type="date"
					icon="i-lucide-calendar"
					class="w-full"
				/>
			</UFormField>

			<!-- PROGRAM (FULL WIDTH) -->
			<UFormField
				label="Program"
				class="sm:col-span-2 md:col-span-3"
			>
				<UInput
					v-model="formStore.student.program"
					icon="i-lucide-graduation-cap"
					placeholder="BS Information Technology"
					class="w-full"
				/>
			</UFormField>
		</div>
	</UForm>
</template>
