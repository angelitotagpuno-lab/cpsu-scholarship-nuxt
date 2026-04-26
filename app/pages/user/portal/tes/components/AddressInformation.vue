<script setup lang="ts">
import { useTesScholarFormStore } from "~/stores/TesScholarForm.store";
import { isRequired, isNumber } from "~/utils/validators";

const formStore = useTesScholarFormStore();

// 🔒 STRICT NUMBERS ONLY (ZIP CODE)
const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];

	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};
</script>

<template>
	<UForm
		:state="formStore.address"
		:validate-on="['input']"
	>
		<h2 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">Address</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<!-- FULL ADDRESS -->
			<UFormField
				label="Full Address"
				name="streetBarangay"
				:rules="[isRequired]"
				validate-on="input"
				class="md:col-span-2"
			>
				<UInput
					v-model="formStore.address.streetBarangay"
					placeholder="Ex: Purok 5, Brgy. San Jose, San Carlos City"
					class="w-full"
				/>
			</UFormField>

			<!-- ZIP CODE -->
			<UFormField
				label="Zip Code"
				name="zipcode"
				:rules="[isRequired, isNumber]"
				validate-on="input"
				class="md:col-span-1"
			>
				<UInput
					v-model="formStore.address.zipcode"
					placeholder="Ex: 6100"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>
		</div>
	</UForm>
</template>
