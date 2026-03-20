<script setup lang="ts">
import { useTesScholarFormStore } from "~/stores/TesScholarForm.store";

const formStore = useTesScholarFormStore();
</script>

<template>
	<div class="space-y-6">
		<h2 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">Address</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<UFormField
				label="Street & Barangay"
				class="md:col-span-2"
			>
				<UInput
					v-model="formStore.address.streetBarangay"
					placeholder="Ex: Purok 5, Brgy. San Jose"
					class="w-full"
				/>
			</UFormField>

			<UFormField
				label="Zip Code"
				class="md:col-span-1"
			>
				<UInput
					v-model="formStore.address.zipcode"
					placeholder="Ex: 6100"
					class="w-full"
				/>
			</UFormField>
		</div>
	</div>
</template>
