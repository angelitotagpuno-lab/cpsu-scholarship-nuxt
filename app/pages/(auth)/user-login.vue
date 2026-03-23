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

// Login form fields
const fields: AuthFormField[] = [
	{
		name: "email",
		type: "email",
		label: "Email",
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
	{
		name: "remember",
		type: "checkbox",
		label: "Remember me",
	},
];

// Social login buttons
const providers = [
	{
		label: "Continue with Google",
		icon: "i-simple-icons-google",
		onClick: () => toast.add({ title: "Google", description: "Login with Google" }),
	},
	{
		label: "Continue with GitHub",
		icon: "i-simple-icons-github",
		onClick: () => toast.add({ title: "GitHub", description: "Login with GitHub" }),
	},
];

// Validation schema
const schema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
	try {
		const user = await store.login(payload.data.email, payload.data.password);

		if (user.role !== "user") {
			throw new Error("Not a user");
		}

		toast.add({
			title: "Success",
			description: "Logged in successfully!",
		});

		router.push("/user");
	} catch {
		toast.add({
			title: "Error",
			description: "Invalid credentials",
			color: "error",
		});
	}
}
</script>

<template>
	<div class="flex flex-col items-center justify-center gap-4 p-4 min-h-screen bg-background">
		<UPageCard class="w-full max-w-md">
			<UAuthForm
				:schema="schema"
				title="User Login"
				description="Enter your credentials to access your account."
				icon="i-lucide-user"
				:fields="fields"
				@submit="onSubmit"
			>
				<!-- ✅ FIXED: REAL submit button -->
				<template #submit>
					<div class="flex justify-center mt-4">
						<UButton
							type="submit"
							color="primary"
							size="lg"
							class="w-full flex justify-center items-center"
							:loading="store.isLoading"
						>
							Login
						</UButton>
					</div>
				</template>

				<!-- Social providers -->
				<template #providers>
					<div class="flex flex-col gap-3 mt-4">
						<UButton
							v-for="(provider, index) in providers"
							:key="index"
							color="neutral"
							size="lg"
							class="w-full flex justify-center items-center gap-2"
							variant="outline"
							:icon="provider.icon"
							@click="provider.onClick"
						>
							{{ provider.label }}
						</UButton>
					</div>
				</template>
			</UAuthForm>

			<!-- Register CTA -->
			<div class="mt-4 text-center text-sm text-muted">
				Don't have an account?
				<NuxtLink
					to="/register"
					class="text-primary font-medium hover:underline"
				>
					Register here
				</NuxtLink>

				<!-- Admin Login Button -->
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
