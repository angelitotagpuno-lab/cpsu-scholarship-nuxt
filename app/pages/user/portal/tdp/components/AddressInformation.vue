<script setup lang="ts">
import { useTdpScholarFormStore } from "~/stores/TdpScholarForm.store";

const formStore = useTdpScholarFormStore();

// STRICT LETTERS ONLY (City / Province)
const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Space"];

	if (!/[A-Za-z\s]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};

// STRICT NUMBERS ONLY (Zip Code)
const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];

	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};
</script>

<template>
	<div class="space-y-6">
		<h3 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">Address</h3>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<!-- STREET / BARANGAY (NO RESTRICTION) -->
			<UFormField label="Street / Barangay">
				<UInput
					v-model="formStore.address.street"
					placeholder="Ex: Purok 5, Brgy. San Jose"
					class="w-full"
				/>
			</UFormField>

			<!-- CITY (LETTERS ONLY) -->
			<UFormField label="City">
				<UInput
					v-model="formStore.address.city"
					placeholder="Ex: San Carlos City"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- PROVINCE (LETTERS ONLY) -->
			<UFormField label="Province">
				<UInput
					v-model="formStore.address.province"
					placeholder="Ex: Negros Occidental"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- ZIP CODE (NUMBERS ONLY) -->
			<UFormField label="Zip Code">
				<UInput
					v-model="formStore.address.zipCode"
					placeholder="Ex: 6100"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>
		</div>
	</div>
</template>
