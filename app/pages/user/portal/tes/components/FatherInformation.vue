<script setup lang="ts">
import { useTesScholarFormStore } from "~/stores/TesScholarForm.store";

const formStore = useTesScholarFormStore();
</script>

<template>
	<div class="space-y-6">
		<h2 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">
			Father Information
		</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<UFormField label="Father Last Name">
				<UInput
					v-model="formStore.father.fatherLastName"
					placeholder="Enter father's last name"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Father First Name">
				<UInput
					v-model="formStore.father.fatherFirstName"
					placeholder="Enter father's first name"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Father Middle Name">
				<UInput
					v-model="formStore.father.fatherMiddleName"
					placeholder="Enter father's middle name"
					class="w-full"
				/>
			</UFormField>

			<UFormField
				label="Father Occupation"
				class="md:col-span-2"
			>
				<UInput
					v-model="formStore.father.fatherOccupation"
					placeholder="Ex: Farmer"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Father Monthly Income">
				<UInput
					v-model="formStore.father.fatherIncome"
					type="number"
					placeholder="Ex: 5000"
					class="w-full"
				/>
			</UFormField>
		</div>
	</div>
</template>
