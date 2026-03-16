<script setup lang="ts">
import { ref } from "vue";

const model = defineModel<any>();

// Options for Sex dropdown
const sexOptions = [
	{ label: "Male", value: "Male" },
	{ label: "Female", value: "Female" },
];

// Options for Year Level dropdown
const yearOptions = [
	{ label: "1", value: "1" },
	{ label: "2", value: "2" },
	{ label: "3", value: "3" },
	{ label: "4", value: "4" },
	{ label: "5", value: "5" },
];
</script>

<template>
	<div>
		<h2 class="text-xl font-semibold mb-4">Student Information</h2>

		<!-- Responsive grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
			<!-- Student ID (span 2 columns on desktop) -->
			<UFormField
				label="Student ID"
				class="md:col-span-2"
			>
				<UInput
					v-model="model.studentId"
					placeholder="Enter your Student ID"
					class="w-full"
				/>
			</UFormField>

			<!-- Sex -->
			<UFormField label="Sex">
				<USelect
					v-model="model.sex"
					:options="sexOptions"
					option-attribute="label"
					value-attribute="value"
					placeholder="Select Sex"
					class="w-full"
				/>
			</UFormField>

			<!-- Year Level -->
			<UFormField label="Year Level">
				<USelect
					v-model="model.yearLevel"
					:options="yearOptions"
					option-attribute="label"
					value-attribute="value"
					placeholder="Select Year Level"
					class="w-full"
				/>
			</UFormField>

			<!-- Last Name -->
			<UFormField label="Last Name">
				<UInput
					v-model="model.lastName"
					placeholder="Enter last name"
					class="w-full"
				/>
			</UFormField>

			<!-- First Name -->
			<UFormField label="First Name">
				<UInput
					v-model="model.firstName"
					placeholder="Enter first name"
					class="w-full"
				/>
			</UFormField>

			<!-- Middle Name -->
			<UFormField label="Middle Name">
				<UInput
					v-model="model.middleName"
					placeholder="Enter middle name"
					class="w-full"
				/>
			</UFormField>

			<!-- Extension Name -->
			<UFormField label="Extension Name">
				<UInput
					v-model="model.extName"
					placeholder="Jr, Sr, III (optional)"
					class="w-full"
				/>
			</UFormField>

			<!-- Birthdate -->
			<UFormField label="Birthdate">
				<UInput
					type="date"
					v-model="model.birthdate"
					class="w-full"
				/>
			</UFormField>

			<!-- Program / Course (span 2 columns on desktop) -->
			<UFormField
				label="Program / Course"
				class="md:col-span-2"
			>
				<UInput
					v-model="model.program"
					placeholder="Example: BS Information Technology"
					class="w-full"
				/>
			</UFormField>
		</div>
	</div>
</template>
