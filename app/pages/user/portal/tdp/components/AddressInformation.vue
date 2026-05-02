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
		<!-- TITLE -->
		<div class="flex items-center gap-2">
			<UIcon
				name="i-lucide-map-pin"
				class="text-emerald-600 size-5"
			/>
			<h2 class="text-lg font-semibold">Address Information</h2>
		</div>

		<!-- STACKED FORM -->
		<UForm class="space-y-5">
			<!-- STREET / BARANGAY -->
			<UFormField label="Street / Barangay">
				<UInput
					v-model="formStore.address.street"
					placeholder="Purok 5, Brgy. San Jose"
					icon="i-lucide-home"
					class="w-full"
				/>
			</UFormField>

			<!-- CITY -->
			<UFormField label="City">
				<UInput
					v-model="formStore.address.city"
					placeholder="San Carlos City"
					icon="i-lucide-building"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- PROVINCE -->
			<UFormField label="Province">
				<UInput
					v-model="formStore.address.province"
					placeholder="Negros Occidental"
					icon="i-lucide-map"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- ZIP CODE -->
			<UFormField label="Zip Code">
				<UInput
					v-model="formStore.address.zipCode"
					placeholder="6100"
					icon="i-lucide-hash"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>
		</UForm>
	</div>
</template>
