<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import { useToast, navigateTo } from "#imports";
import LoginFooter from "~/components/LoginFooter.vue"; // import your login footer

definePageMeta({
	layout: "landing", // keeps your header, but we manually add login footer
});

const toast = useToast();

// Registration form fields
const fields: AuthFormField[] = [
	{
		name: "name",
		label: "Full Name",
		type: "text",
		placeholder: "Enter your full name",
		required: true,
	},
	{ name: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true },
	{
		name: "password",
		label: "Password",
		type: "password",
		placeholder: "Enter a password",
		required: true,
	},
	{
		name: "confirmPassword",
		label: "Confirm Password",
		type: "password",
		placeholder: "Confirm your password",
		required: true,
	},
];

// Social providers
const providers = [
	{
		label: "Google",
		icon: "i-simple-icons-google",
		onClick: () => toast.add({ title: "Google", description: "Register with Google" }),
	},
	{
		label: "GitHub",
		icon: "i-simple-icons-github",
		onClick: () => toast.add({ title: "GitHub", description: "Register with GitHub" }),
	},
];

// Validation schema
const schema = z
	.object({
		name: z.string().min(2, "Name is required"),
		email: z.string().email("Invalid email"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string().min(8, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords must match",
		path: ["confirmPassword"],
	});

type Schema = z.output<typeof schema>;

function onSubmit(payload: FormSubmitEvent<Schema>) {
	console.log("Registered data:", payload.data);
	toast.add({ title: "Success", description: "Account registered successfully!" });
	navigateTo("/login"); // redirect after successful registration
}
</script>

<template>
	<div class="flex flex-col min-h-screen justify-between bg-background">
		<!-- Registration form in the middle -->
		<div class="flex flex-col items-center justify-center gap-4 p-4 flex-1">
			<UPageCard class="w-full max-w-md">
				<UAuthForm
					:schema="schema"
					title="Register"
					description="Create a new account to access the CPSU Scholarship portal."
					icon="i-lucide-user-plus"
					:fields="fields"
					:providers="providers"
					@submit="onSubmit"
				/>

				<!-- Login CTA -->
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

		<!-- Use the LoginFooter at the bottom -->
		<LoginFooter />
	</div>
</template>

<style scoped>
/* Ensure full height so footer sticks at bottom */
</style>
