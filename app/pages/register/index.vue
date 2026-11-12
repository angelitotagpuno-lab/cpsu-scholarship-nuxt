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

const fields: AuthFormField[] = [
	{
		name: "studentNumber",
		label: "Student Number",
		type: "text",
		placeholder: "Enter your student number",
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
	studentNumber: z.string().min(1, "Student number is required"),
	email: z.email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
	const { studentNumber, email, password } = payload.data;

	const verification = await store.verifyStudent(studentNumber);

	if (!verification) {
		toast.add({
			title: "Verification Failed",
			description: store.errorMessage || "Unable to verify student number",
			color: "error",
		});
		return;
	}

	if (!verification.allowed) {
		toast.add({
			title: "Not Eligible for Registration",
			description: "Your student number is not on the allowlist.",
			color: "error",
		});
		return;
	}

	if (verification.isRegistered) {
		toast.add({
			title: "Already Registered",
			description: "This student number already has an account.",
			color: "error",
		});
		return;
	}

	const success = await store.registerStudent({
		studentNumber,
		email,
		password,
	});

	if (!success) {
		toast.add({
			title: "Registration Failed",
			description: store.errorMessage || "Unable to create account",
			color: "error",
		});
		return;
	}

	toast.add({
		title: "Success",
		description: "Account registered successfully!",
		color: "success",
	});

	await navigateTo("/user-login");
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
