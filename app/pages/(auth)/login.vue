<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import { navigateTo } from "#imports";
import { LoginSchema, type LoginInput } from "~~/shared/schemas/auth";

definePageMeta({
	layout: "login",
});

const store = useAuthStore();

const fields: AuthFormField[] = [
	{
		name: "email",
		type: "email",
		label: "Admin Email",
		size: "lg",
		placeholder: "Enter admin email",
		required: true,
	},
	{
		name: "password",
		label: "Password",
		type: "password",
		size: "lg",
		placeholder: "Enter password",
		required: true,
	},
];

async function onSubmit(payload: FormSubmitEvent<LoginInput>) {
	console.log("ADMIN LOGIN:", payload.data); // ✅ debug

	try {
		await store.login(payload.data.email, payload.data.password);

		store.errorMessage = null; // ✅ FIX

		await navigateTo("/admin/home");
	} catch (e) {
		console.error(e);
		store.errorMessage = "Invalid credentials";
	}
}
</script>

<template>
	<u-container class="h-[calc(100vh-64px)] w-full flex justify-center items-center">
		<UPageCard class="w-full max-w-md">
			<UAuthForm
				:schema="LoginSchema"
				:fields="fields"
				title="Admin Login"
				icon="i-lucide-shield"
				submit-label="Log in"
				@submit="onSubmit"
			>
				<template
					v-if="store.errorMessage"
					#validation
				>
					<UAlert
						:title="store.errorMessage ?? 'Invalid admin credentials'"
						color="error"
						icon="i-lucide-info"
					/>
				</template>

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

				<template #footer> Authorized administrators only. </template>
			</UAuthForm>
		</UPageCard>
	</u-container>
</template>
