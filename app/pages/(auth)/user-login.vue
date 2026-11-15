<script setup lang="ts">
import * as z from "zod";

import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

import { useAuthStore } from "~/stores/auth.store";

definePageMeta({
	layout: "login",
});

const toast = useToast();
const store = useAuthStore();

const fields: AuthFormField[] = [
	{
		name: "studentNumber",
		type: "text",
		label: "Student Number",
		placeholder: "Enter your student number",
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
	studentNumber: z.string().trim().min(1, "Student number is required"),

	password: z.string().min(8, "Password must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
	if (store.isLoading) return;

	const success = await store.loginStudent({
		studentNumber: payload.data.studentNumber,
		password: payload.data.password,
	});

	if (!success) {
		toast.add({
			title: "Login Failed",
			description: store.errorMessage || "Invalid student credentials.",
			color: "error",
		});

		return;
	}

	toast.add({
		title: "Login Successful",
		description: "Welcome to the Student Portal!",
		color: "success",
	});

	await navigateTo("/user");
}
</script>

<template>
	<div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4">
		<UPageCard class="w-full max-w-md">
			<UAuthForm
				:schema="schema"
				:fields="fields"
				title="Student Login"
				description="Enter your student number and password."
				icon="i-lucide-graduation-cap"
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
			</UAuthForm>

			<div class="mt-4 text-center text-sm text-muted">
				Don't have an account?

				<NuxtLink
					to="/register"
					class="font-medium text-primary hover:underline"
				>
					Register here
				</NuxtLink>

				<div class="mt-4 flex justify-center">
					<NuxtLink to="/login">
						<UButton
							variant="ghost"
							size="sm"
							icon="i-lucide-shield"
						>
							Admin / Personnel Login
						</UButton>
					</NuxtLink>
				</div>
			</div>
		</UPageCard>
	</div>
</template>
