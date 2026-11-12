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
		<div class="space-y-5">
			<!-- FULL ADDRESS -->
			<UFormField
				label="Full Address"
				name="streetBarangay"
				:rules="[isRequired]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.address.streetBarangay"
					placeholder="Ex: Purok 5, Brgy. San Jose, San Carlos City"
					class="w-full"
					icon="i-lucide-map-pin"
				/>
			</UFormField>

			<!-- ZIP CODE -->
			<UFormField
				label="Zip Code"
				name="zipcode"
				:rules="[isRequired, isNumber]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.address.zipcode"
					placeholder="Ex: 6100"
					class="w-full"
					icon="i-lucide-hash"
					@keydown="allowNumbers"
				/>
			</UFormField>
		</div>
	</UForm>
</template>
