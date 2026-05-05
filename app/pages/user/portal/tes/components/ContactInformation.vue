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
	<UForm
		:schema="schema"
		:state="formStore.contact"
		:validate-on="['input']"
	>
		<div class="space-y-5">
			<!-- CONTACT NUMBER -->
			<UFormField
				label="Contact Number"
				name="contactNumber"
			>
				<UInput
					v-model="formStore.contact.contactNumber"
					icon="i-lucide-phone"
					placeholder="Ex: 09XXXXXXXXX"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<!-- EMAIL -->
			<UFormField
				label="Email"
				name="email"
			>
				<UInput
					v-model="formStore.contact.email"
					icon="i-lucide-mail"
					type="email"
					placeholder="example@email.com"
					class="w-full"
				/>
			</UFormField>
		</div>
	</UForm>
</template>
