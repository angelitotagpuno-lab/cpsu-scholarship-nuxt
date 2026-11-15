<script setup lang="ts">
import { useTesScholarFormStore } from "~/stores/tes-form.store";

const formStore = useTesScholarFormStore();

function allowNumbers(e: KeyboardEvent) {
	if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) {
		return;
	}

	if (!/[0-9]/.test(e.key)) {
		e.preventDefault();
	}
}
</script>

<template>
	<div class="space-y-5">
		<h3 class="font-semibold">Permanent Address</h3>

		<UFormField label="Street / Purok">
			<UInput
				v-model="formStore.address.street"
				icon="i-lucide-map-pin"
				placeholder="Purok 5"
				class="w-full"
			/>
		</UFormField>

		<UFormField
			label="Barangay"
			required
		>
			<UInput
				v-model="formStore.address.barangay"
				icon="i-lucide-map-pin"
				placeholder="San Jose"
				class="w-full"
			/>
		</UFormField>

		<UFormField
			label="City / Municipality"
			required
		>
			<UInput
				v-model="formStore.address.cityMunicipality"
				icon="i-lucide-building-2"
				placeholder="San Carlos City"
				class="w-full"
			/>
		</UFormField>

		<UFormField
			label="Province"
			required
		>
			<UInput
				v-model="formStore.address.province"
				icon="i-lucide-map"
				placeholder="Negros Occidental"
				class="w-full"
			/>
		</UFormField>

		<UFormField
			label="Zip Code"
			required
		>
			<UInput
				v-model="formStore.address.zipcode"
				icon="i-lucide-hash"
				placeholder="6127"
				class="w-full"
				@keydown="allowNumbers"
			/>
		</UFormField>
	</div>
</template>
