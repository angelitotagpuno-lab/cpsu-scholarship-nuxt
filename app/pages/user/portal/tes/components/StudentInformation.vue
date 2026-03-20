<script setup lang="ts">
import { useTesScholarFormStore } from "~/stores/TesScholarForm.store";

const formStore = useTesScholarFormStore();

const sexOptions = [
	{ label: "Male", value: "Male" },
	{ label: "Female", value: "Female" },
];

const yearOptions = [
	{ label: "1", value: "1" },
	{ label: "2", value: "2" },
	{ label: "3", value: "3" },
	{ label: "4", value: "4" },
	{ label: "5", value: "5" },
];
</script>

<template>
	<div class="space-y-6">
		<h2 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">
			Student Information
		</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<UFormField
				label="Student ID"
				class="md:col-span-2"
			>
				<UInput
					v-model="formStore.student.studentId"
					placeholder="Enter your Student ID"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Sex">
				<USelect
					v-model="formStore.student.sex"
					:options="sexOptions"
					placeholder="Select Sex"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Year Level">
				<USelect
					v-model="formStore.student.yearLevel"
					:options="yearOptions"
					placeholder="Select Year Level"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Last Name">
				<UInput
					v-model="formStore.student.lastName"
					placeholder="Enter last name"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="First Name">
				<UInput
					v-model="formStore.student.firstName"
					placeholder="Enter first name"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Middle Name">
				<UInput
					v-model="formStore.student.middleName"
					placeholder="Enter middle name"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Extension Name">
				<UInput
					v-model="formStore.student.extName"
					placeholder="Jr, Sr, III (optional)"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Birthdate">
				<UInput
					v-model="formStore.student.birthdate"
					type="date"
					class="w-full"
				/>
			</UFormField>

			<UFormField
				label="Program / Course"
				class="md:col-span-2"
			>
				<UInput
					v-model="formStore.student.program"
					placeholder="Example: BS Information Technology"
					class="w-full"
				/>
			</UFormField>
		</div>
	</div>
</template>
