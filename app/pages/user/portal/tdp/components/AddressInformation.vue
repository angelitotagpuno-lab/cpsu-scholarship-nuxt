<script setup lang="ts">
import { useApplicationStore } from "~/stores/application.store";

const store = useApplicationStore();

const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", " "];
	if (!/[A-Za-z\s]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
};

const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
};
</script>

<template>
	<UForm class="space-y-6">
		<!-- HEADER -->
		<div class="flex items-center gap-2">
			<UIcon
				name="i-lucide-home"
				class="text-emerald-600 size-5"
			/>
			<h2 class="text-lg font-semibold">Address Information</h2>
		</div>

		<!-- GRID -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- STREET (FULL WIDTH) -->
			<UFormField
				label="Street"
				class="md:col-span-3"
			>
				<UInput
					v-model="store.item.profile.address.street"
					icon="i-lucide-home"
					placeholder="Enter street"
					class="w-full"
				/>
			</UFormField>

			<!-- BARANGAY (FULL WIDTH) -->
			<UFormField
				label="Barangay"
				class="md:col-span-3"
			>
				<UInput
					v-model="store.item.profile.address.barangay"
					icon="i-lucide-map-pin"
					placeholder="Enter barangay"
					class="w-full"
				/>
			</UFormField>

			<!-- CITY -->
			<UFormField label="City">
				<UInput
					v-model="store.item.profile.address.city"
					icon="i-lucide-building"
					placeholder="City"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- PROVINCE -->
			<UFormField label="Province">
				<UInput
					v-model="store.item.profile.address.province"
					icon="i-lucide-map"
					placeholder="Province"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- ZIP CODE -->
			<UFormField label="Zip Code">
				<UInput
					v-model="store.item.profile.address.zipcode"
					icon="i-lucide-hash"
					placeholder="Zip Code"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>
		</div>
	</UForm>
</template>
