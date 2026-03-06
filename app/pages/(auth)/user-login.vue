<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import { useToast } from "#imports";

definePageMeta({
	layout: "landing",
});

const toast = useToast();

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

// Social login buttons (wide)
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

function onSubmit(payload: FormSubmitEvent<Schema>) {
	console.log("Submitted", payload.data);
	toast.add({ title: "Success", description: "Logged in!" });
}
</script>

<template>
	<div class="flex flex-col items-center justify-center gap-4 p-4 min-h-screen bg-background">
		<UPageCard class="w-full max-w-md">
			<UAuthForm
				:schema="schema"
				title="Login"
				description="Enter your credentials to access your account."
				icon="i-lucide-user"
				:fields="fields"
				@submit="onSubmit"
			>
				<!-- Submit button as a link with "Login" centered -->
				<template #submit>
					<div class="flex justify-center mt-4">
						<NuxtLink
							to="/user"
							class="w-full md:w-1/2"
						>
							<UButton
								color="primary"
								size="lg"
								class="w-full flex justify-center items-center"
							>
								Login
							</UButton>
						</NuxtLink>
					</div>
				</template>

				<!-- Wide social provider buttons -->
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
			</div>
		</UPageCard>
	</div>
	<LoginFooter />
</template>
