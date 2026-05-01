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
			<!-- ID -->
			<UFormField label="Student ID">
				<UInput
					v-model="formStore.student.studentId"
					placeholder="Student ID"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<!-- SEX -->
			<UFormField label="Sex">
				<USelect
					v-model="formStore.student.sex"
					placeholder="Male"
					class="w-full"
					:items="SEX_OPTIONS"
				/>
			</UFormField>

			<!-- YEAR -->
			<UFormField label="Year Level">
				<USelect
					v-model="formStore.student.yearLevel"
					placeholder="1"
					class="w-full"
					:items="YEAR_OPTIONS"
				/>
			</UFormField>

			<!-- LAST NAME -->
			<UFormField label="Last Name">
				<UInput
					v-model="formStore.student.lastName"
					placeholder="Dela Cruz"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- FIRST NAME -->
			<UFormField label="First Name">
				<UInput
					v-model="formStore.student.firstName"
					placeholder="Juan"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- MIDDLE -->
			<UFormField label="Middle Name">
				<UInput
					v-model="formStore.student.middleName"
					placeholder="Delapena"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- EXT -->
			<UFormField label="Extension">
				<UInput
					v-model="formStore.student.extName"
					placeholder="Ex: Jr, Sr, III"
					class="w-full"
				/>
			</UFormField>

			<!-- BIRTHDATE -->
			<UFormField label="Birthdate">
				<UInput
					v-model="formStore.student.birthdate"
					class="w-full"
					type="date"
				/>
			</UFormField>

			<!-- PROGRAM -->
			<UFormField label="Program">
				<UInput
					v-model="formStore.student.program"
					placeholder="Ex. Bachelor of Science in Information Technology"
					class="w-full"
				/>
			</UFormField>
		</div>
	</UForm>
</template>
