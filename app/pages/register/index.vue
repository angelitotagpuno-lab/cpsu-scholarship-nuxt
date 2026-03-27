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
	{ name: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true },
	{
		name: "password",
		label: "Password",
		type: "password",
		placeholder: "Enter a password",
		required: true,
	},
	{
		name: "first_name",
		label: "First Name",
		type: "text",
		placeholder: "Enter your first name",
		required: true,
	},
	{
		name: "last_name",
		label: "Last Name",
		type: "text",
		placeholder: "Enter your last name",
		required: true,
	},
	{
		name: "middle_name",
		label: "Middle Name",
		type: "text",
		placeholder: "Enter your middle name",
		required: false,
	},
	{
		name: "year_level",
		label: "Year Level",
		type: "number",
		placeholder: "Enter your year level",
		required: true,
	},
	{
		name: "ext_name",
		label: "Extension Name",
		type: "text",
		placeholder: "e.g., Jr., Sr.",
		required: false,
	},
	{
		name: "contact_number",
		label: "Contact Number",
		type: "tel",
		placeholder: "Enter your contact number",
		required: true,
	},
	{
		name: "sex",
		label: "Sex",
		type: "select",
		options: ["Male", "Female", "Other"],
		required: true,
	},
];

// Validation schema
const schema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	first_name: z.string().min(1, "First Name is required"),
	last_name: z.string().min(1, "Last Name is required"),
	middle_name: z.string().optional(),
	year_level: z.number().min(1, "Year Level is required"),
	ext_name: z.string().optional(),
	contact_number: z.string().min(7, "Contact Number is required"),
	sex: z.enum(["Male", "Female", "Other"]),
});

type Schema = z.output<typeof schema>;

// ✅ Updated onSubmit to call backend
async function onSubmit(payload: FormSubmitEvent<Schema>) {
	try {
		await store.registerUser({
			email: payload.data.email,
			password: payload.data.password,
		});

		toast.add({
			title: "Success",
			description: "Account registered successfully!",
		});

		navigateTo("/user-login");
	} catch (e) {
		console.error(e);
		toast.add({
			title: "Error",
			description: "Registration failed",
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
				/>

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
