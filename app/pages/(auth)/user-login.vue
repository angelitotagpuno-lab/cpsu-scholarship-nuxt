<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import { useToast, useRouter } from "#imports";
import { useAuthStore } from "~/stores/auth.store";

definePageMeta({
	layout: "login",
});

const toast = useToast();
const router = useRouter();
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
	studentNumber: z.string().min(1, "Student number is required"),
	password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
	const success = await store.loginStudent({
		studentNumber: payload.data.studentNumber,
		password: payload.data.password,
	});

	if (!success) {
		toast.add({
			title: "Login Failed",
			description: store.errorMessage || "Invalid student credentials",
			color: "error",
		});
		return;
	}

	await router.push("/user");
}
</script>

<template>
	<div class="flex flex-col items-center justify-center gap-4 p-4 min-h-screen bg-background">
		<UPageCard class="w-full max-w-md">
			<UAuthForm
				:schema="schema"
				:fields="fields"
				title="User Login"
				description="Enter your credentials to access your account."
				icon="i-lucide-user"
				:loading="store.isLoading"
				@submit="onSubmit"
			>
				<template #submit>
					<div class="flex justify-center mt-4">
						<UButton
							label="Sign in"
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
				Don't have an account?
				<NuxtLink
					to="/register"
					class="text-primary font-medium hover:underline"
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
							Admin Login
						</UButton>
					</NuxtLink>
				</div>
			</div>
		</UPageCard>
	</div>
</template>
