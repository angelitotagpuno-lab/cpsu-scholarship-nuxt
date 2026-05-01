<script setup lang="ts">
import { useTesScholarFormStore } from "~/stores/TesScholarForm.store";
import z from "zod";

const formStore = useTesScholarFormStore();

const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];

	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};

/**
 * ZOD SCHEMA
 */
const schema = z.object({
	contactNumber: z
		.string()
		.min(1, "Contact number is required")
		.regex(/^[0-9]+$/, "Numbers only"),

	email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});
</script>

<template>
	<!-- IMPORTANT: pass .contact.value (because it's a ref in your store) -->
	<UForm
		:schema="schema"
		:state="formStore.contact"
		:validate-on="['input']"
	>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<!-- CONTACT NUMBER -->
			<UFormField
				label="Contact Number"
				name="contactNumber"
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
