<script setup lang="ts">
import { useTesScholarFormStore } from "~/stores/TesScholarForm.store";
import { isRequired, isNumber, isEmail } from "~/utils/validators";

const formStore = useTesScholarFormStore();

// 🔒 STRICT NUMBERS ONLY (CONTACT NUMBER)
const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];

	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};
</script>

<template>
	<UForm
		:state="formStore.contact"
		:validate-on="['input']"
	>
		<h2 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">
			Contact Information
		</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<!-- CONTACT NUMBER -->
			<UFormField
				label="Contact Number"
				name="contactNumber"
				:rules="[isRequired, isNumber]"
				validate-on="input"
				class="md:col-span-1"
			>
				<UInput
					v-model="formStore.contact.contactNumber"
					placeholder="Ex: 09XXXXXXXXX"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<!-- EMAIL -->
			<UFormField
				label="Email"
				name="email"
				:rules="[isRequired, isEmail]"
				validate-on="input"
				class="md:col-span-2"
			>
				<UInput
					v-model="formStore.contact.email"
					type="email"
					placeholder="example@email.com"
					class="w-full"
				/>
			</UFormField>
		</div>
	</UForm>
</template>
