<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import { useToast, navigateTo } from "#imports";
import { useAuthStore } from "~/stores/auth.store";

definePageMeta({
	layout: "login",
});

const toast = useToast();
const store = useAuthStore();

// Registration form fields
const fields: AuthFormField[] = [
	{
		name: "schoolId",
		label: "School ID",
		type: "text",
		placeholder: "Enter your School ID",
		required: true,
		icon: "i-lucide-id-card",
	},
	{
		name: "email",
		label: "Email",
		type: "email",
		placeholder: "Enter your email",
		required: true,
		icon: "i-lucide-mail",
	},
	{
		name: "password",
		label: "Password",
		type: "password",
		placeholder: "Enter a password",
		required: true,
		icon: "i-lucide-lock",
	},
];

const schema = z.object({
	schoolId: z.string().min(1, "School ID is required"),
	email: z.email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
	try {
		await store.register({
			schoolId: payload.data.schoolId,
			email: payload.data.email,
			password: payload.data.password,
		});

		toast.add({
			title: "Success",
			description: "Account registered successfully!",
		});

		navigateTo("/user-login");
	} catch {
		toast.add({
			title: "Error",
			description: store.errorMessage || "Registration failed",
			color: "error",
		});
	}
}
</script>

<template>
	<div class="flex flex-col min-h-screen justify-between bg-background">
		<div class="flex flex-col items-center justify-center gap-4 p-4 flex-1">
			<UPageCard class="w-full max-w-md">
				<UAuthForm
					:schema="schema"
					title="Register"
					description="Create a new account to access the CPSU Scholarship portal."
					icon="i-lucide-user-plus"
					:fields="fields"
					@submit="onSubmit"
				>
					<template #submit>
						<div class="flex justify-center mt-4">
							<UButton
								label="Sign up"
								type="submit"
								color="primary"
								size="lg"
								class="w-full flex justify-center items-center"
								:loading="store.isLoading"
							/>
						</div>
					</template>
				</UAuthForm>

				<div class="mt-4 text-center text-sm text-muted">
					Already have an account?
					<NuxtLink
						to="/user-login"
						class="text-primary font-medium hover:underline"
					>
						Log in here
					</NuxtLink>
				</div>
			</UPageCard>
		</div>
	</div>
</template>
