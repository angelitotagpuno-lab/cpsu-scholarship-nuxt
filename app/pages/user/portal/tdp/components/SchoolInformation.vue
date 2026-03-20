<script setup lang="ts">
import { useTdpScholarFormStore } from "~/stores/TdpScholarForm.store";

const formStore = useTdpScholarFormStore();
</script>

<template>
	<div class="space-y-6">
		<h3 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">
			School Information
		</h3>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<UFormField
				label="School Name"
				class="md:col-span-2"
			>
				<UInput
					v-model="formStore.school.schoolName"
					placeholder="Ex: Central Philippines State University"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="School ID">
				<UInput
					v-model="formStore.school.schoolId"
					placeholder="Ex: 123456"
					class="w-full"
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
					:options="[
						{ label: 'Public', value: 'Public' },
						{ label: 'Private', value: 'Private' },
					]"
					option-attribute="label"
					value-attribute="value"
					placeholder="Select Sector"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Year Level">
				<UInput
					v-model="formStore.school.yearLevel"
					placeholder="Ex: 2nd Year"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Course">
				<UInput
					v-model="formStore.school.course"
					placeholder="Ex: BS Information Technology"
					class="w-full"
				/>
			</UFormField>
		</div>
	</div>
</template>
