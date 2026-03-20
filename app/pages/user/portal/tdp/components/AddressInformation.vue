<script setup lang="ts">
import { useTdpScholarFormStore } from "~/stores/TdpScholarForm.store";

const formStore = useTdpScholarFormStore();
</script>

<template>
	<div class="space-y-6">
		<h3 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">Address</h3>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<UFormField label="Street / Barangay">
				<UInput
					v-model="formStore.address.street"
					placeholder="Ex: Purok 5, Brgy. San Jose"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="City">
				<UInput
					v-model="formStore.address.city"
					placeholder="Ex: San Carlos City"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Province">
				<UInput
					v-model="formStore.address.province"
					placeholder="Ex: Negros Occidental"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Zip Code">
				<UInput
					v-model="formStore.address.zipCode"
					placeholder="Ex: 6100"
					class="w-full"
				/>
			</UFormField>
		</div>
	</div>
</template>
