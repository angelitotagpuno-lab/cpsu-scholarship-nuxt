<script setup lang="ts">
import { useTdpScholarFormStore } from "~/stores/TdpScholarForm.store";

const formStore = useTdpScholarFormStore();

const SEX_OPTIONS = ["Male", "Female"];
</script>

<template>
	<div class="space-y-6">
		<h3 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">
			Student Information
		</h3>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<UFormField label="Last Name">
				<UInput
					v-model="formStore.student.lastName"
					placeholder="Ex: Dela Cruz"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="First Name">
				<UInput
					v-model="formStore.student.firstName"
					placeholder="Ex: Juan"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Middle Name">
				<UInput
					v-model="formStore.student.middleName"
					placeholder="Ex: M."
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Sex">
				<USelect
					v-model="formStore.student.sex"
					:items="SEX_OPTIONS"
					placeholder="Select sex"
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

			<UFormField label="Place of Birth">
				<UInput
					v-model="formStore.student.birthPlace"
					placeholder="Ex: San Carlos City"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Citizenship">
				<UInput
					v-model="formStore.student.citizenship"
					placeholder="Ex: Filipino"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Mobile Number">
				<UInput
					v-model="formStore.student.mobile"
					placeholder="Ex: 09123456789"
					class="w-full"
				/>
			</UFormField>

			<UFormField
				label="Email Address"
				class="md:col-span-2"
			>
				<UInput
					v-model="formStore.student.email"
					placeholder="Ex: juan.delacruz@email.com"
					class="w-full"
				/>
			</UFormField>
		</div>
	</div>
</template>

<style scoped>
/* Placeholder color */
input::placeholder {
	color: #9ca3af; /* gray-400 */
	opacity: 1;
}

/* Dark mode input colors */
.dark input {
	background-color: #f9fafb05; /* semi-transparent so light/dark adapts */
	border-color: #9ca3af;
	color: #f9fafb;
}
</style>
