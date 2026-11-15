<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

import * as z from "zod";
import { useAuthStore } from "~/stores/auth.store";

definePageMeta({
	layout: "login",
});

const store = useAuthStore();
const toast = useToast();

const fields: AuthFormField[] = [
	{
		name: "email",
		type: "email",
		label: "Email Address",
		placeholder: "Enter your email",
		required: true,
	},
	{
		name: "password",
		type: "password",
		label: "Password",
		placeholder: "Enter your password",
		required: true,
	},
];

const schema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
	if (store.isLoading) return;

	const success = await store.login({
		email: payload.data.email,
		password: payload.data.password,
	});

	if (!success) {
		toast.add({
			title: "Login Failed",
			description: store.errorMessage || "Unable to sign in.",
			color: "error",
		});

		return;
	}

	toast.add({
		title: "Login Successful",
		description: "Welcome to the dashboard!",
		color: "success",
	});

	await navigateTo("/admin/home");
}
</script>

<template>
	<div class="flex min-h-screen items-center justify-center bg-background p-4">
		<UPageCard class="w-full max-w-md">
			<UAuthForm
				:schema="schema"
				:fields="fields"
				title="Admin / Personnel Login"
				description="Sign in with your authorized account."
				icon="i-lucide-shield"
				:loading="store.isLoading"
				@submit="onSubmit"
			>
				<template #validation>
					<UAlert
						v-if="store.errorMessage"
						:title="store.errorMessage"
						color="error"
						icon="i-lucide-alert-circle"
					/>
				</template>

				<template #submit>
					<UButton
						label="Sign In"
						type="submit"
						color="primary"
						size="lg"
						block
						:loading="store.isLoading"
						:disabled="store.isLoading"
					/>
				</template>

				<template #footer>
					<div class="text-center">
						<p class="text-sm text-muted">Authorized administrators and personnel only.</p>

						<NuxtLink
							to="/user-login"
							class="mt-3 inline-block text-sm font-medium text-primary hover:underline"
						>
							Student Login
						</NuxtLink>
					</div>
				</template>
			</UAuthForm>
		</UPageCard>
	</div>
</template>
