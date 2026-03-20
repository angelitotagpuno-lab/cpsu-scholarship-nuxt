<script setup lang="ts">
import { useTesScholarFormStore } from "~/stores/TesScholarForm.store";

const formStore = useTesScholarFormStore();
</script>

<template>
	<div class="space-y-6">
		<h2 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">
			Mother Information
		</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<UFormField label="Mother Maiden Last Name">
				<UInput
					v-model="formStore.mother.motherLastName"
					placeholder="Enter mother's maiden last name"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Mother First Name">
				<UInput
					v-model="formStore.mother.motherFirstName"
					placeholder="Enter mother's first name"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Mother Middle Name">
				<UInput
					v-model="formStore.mother.motherMiddleName"
					placeholder="Enter mother's middle name"
					class="w-full"
				/>
			</UFormField>

			<UFormField
				label="Mother Occupation"
				class="md:col-span-2"
			>
				<UInput
					v-model="formStore.mother.motherOccupation"
					placeholder="Ex: Vendor"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Mother Monthly Income">
				<UInput
					v-model="formStore.mother.motherIncome"
					type="number"
					placeholder="Ex: 4000"
					class="w-full"
				/>
			</UFormField>
		</div>
	</div>
</template>
