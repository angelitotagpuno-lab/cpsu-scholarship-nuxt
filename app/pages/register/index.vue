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
	studentNumber: z.string().trim().min(1, "Student number is required"),

	email: z.email("Invalid email address"),

	password: z.string().min(8, "Password must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
	if (store.isLoading) return;

	const studentNumber = payload.data.studentNumber.trim();

	const email = payload.data.email.trim();

	const password = payload.data.password;

	// STEP 1: Verify student number
	const verification = await store.verifyStudent(studentNumber);

	if (!verification) {
		toast.add({
			title: "Verification Failed",
			description: store.errorMessage || "Unable to verify student number.",
			color: "error",
			icon: "i-lucide-circle-x",
		});

		return;
	}

	// STEP 2: Check if student is allowlisted
	if (!verification.allowed) {
		toast.add({
			title: "Not Eligible for Registration",
			description:
				"Your student number is not on the allowlist. Please contact the scholarship administrator.",
			color: "error",
			icon: "i-lucide-shield-alert",
		});

		return;
	}

	// STEP 3: Check if already registered
	if (verification.isRegistered) {
		toast.add({
			title: "Already Registered",
			description: "This student number already has an account. Please log in instead.",
			color: "warning",
			icon: "i-lucide-user-check",
		});

		return;
	}

	// STEP 4: Confirm registration action
	if (verification.nextAction !== "register") {
		toast.add({
			title: "Registration Unavailable",
			description: "Your student account cannot be registered at this time.",
			color: "warning",
			icon: "i-lucide-alert-triangle",
		});

		return;
	}

	// STEP 5: Register student
	const success = await store.registerStudent({
		studentNumber,
		email,
		password,
	});

	if (!success) {
		toast.add({
			title: "Registration Failed",
			description: store.errorMessage || "Unable to create your account.",
			color: "error",
			icon: "i-lucide-circle-x",
		});

		return;
	}

	// STEP 6: Registration successful
	toast.add({
		title: "Registration Successful",
		description: "Your student account has been created. Please log in.",
		color: "success",
		icon: "i-lucide-circle-check",
	});

	await navigateTo("/user-login");
}
</script>

<template>
	<div class="flex min-h-screen flex-col justify-between bg-background">
		<div class="flex flex-1 flex-col items-center justify-center gap-4 p-4">
			<UPageCard class="w-full max-w-md">
				<UAuthForm
					:schema="schema"
					title="Register"
					description="Create a new account to access the CPSU Scholarship portal."
					icon="i-lucide-user-plus"
					:fields="fields"
					:loading="store.isLoading"
					@submit="onSubmit"
				>
					<template #validation>
						<UAlert
							v-if="store.errorMessage"
							:title="store.errorMessage"
							color="error"
							icon="i-lucide-alert-circle"
							class="mb-4"
						/>
					</template>

					<template #submit>
						<div class="mt-4 flex justify-center">
							<UButton
								label="Sign up"
								type="submit"
								color="primary"
								size="lg"
								class="flex w-full items-center justify-center"
								:loading="store.isLoading"
								:disabled="store.isLoading"
							/>
						</div>
					</template>
				</UAuthForm>

				<div class="mt-4 text-center text-sm text-muted">
					Already have an account?

					<NuxtLink
						to="/user-login"
						class="font-medium text-primary hover:underline"
					>
						Log in here
					</NuxtLink>
				</div>
			</UPageCard>
		</div>
	</div>
</template>
