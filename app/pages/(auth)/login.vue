<script setup lang="ts">
import * as z from "zod";
import { ref } from "vue";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import { navigateTo } from "#imports";

definePageMeta({
	layout: "landing",
});

const toast = useToast();
const loginError = ref(false);

const fields: AuthFormField[] = [
	{
		name: "email",
		type: "email",
		label: "Admin Email",
		placeholder: "Enter admin email",
		required: true,
	},
	{
		name: "password",
		label: "Password",
		type: "password",
		placeholder: "Enter password",
		required: true,
	},
];

const schema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

function onSubmit(payload: FormSubmitEvent<Schema>) {
	const { email, password } = payload.data;

	if (email === "admin@cpsu.edu" && password === "admin1234") {
		toast.add({ title: "Success", description: "Logging in..." });
		navigateTo("/admin/home");
	} else {
		loginError.value = true;
	}
}
</script>

<template>
	<u-container class="h-[calc(100vh-64px)] w-full flex justify-center items-center">
		<UPageCard class="w-full max-w-md">
			<UAuthForm
				:schema="schema"
				:fields="fields"
				title="Admin Login"
				icon="i-lucide-shield"
				submit-label="Log in"
				@submit="onSubmit"
			>
				<template #submit>
					<div class="flex justify-center mt-4">
						<UButton
							type="submit"
							color="primary"
							class="w-1/2 flex justify-center items-center"
						>
							Log in
						</UButton>
					</div>
				</template>

				<template
					v-if="loginError"
					#validation
				>
					<UAlert
						color="error"
						icon="i-lucide-info"
						title="Invalid admin credentials"
					/>
				</template>

				<template #footer> Authorized administrators only. </template>
			</UAuthForm>
		</UPageCard>
	</u-container>
</template>
