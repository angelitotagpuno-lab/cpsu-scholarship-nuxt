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
	<UForm
		:state="store.item.profile.address"
		class="space-y-5"
	>
		<UFormField label="Street">
			<UInput v-model="store.item.profile.address.street" />
		</UFormField>

		<UFormField label="Barangay">
			<UInput v-model="store.item.profile.address.barangay" />
		</UFormField>

		<UFormField label="City">
			<UInput
				v-model="store.item.profile.address.city"
				@keydown="allowLetters"
			/>
		</UFormField>

		<UFormField label="Province">
			<UInput
				v-model="store.item.profile.address.province"
				@keydown="allowLetters"
			/>
		</UFormField>

		<UFormField label="Zip Code">
			<UInput
				v-model="store.item.profile.address.zipcode"
				@keydown="allowNumbers"
			/>
		</UFormField>
	</UForm>
</template>
