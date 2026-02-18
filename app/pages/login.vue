<template>
	<div class="flex flex-col items-center justify-center gap-4 p-4 mt-8">
		<UPageCard class="w-full max-w-md">
			<UAuthForm :schema="schema" :fields="fields" title="Admin Login" icon="i-lucide-shield" submit-label="Log in"
				@submit="onSubmit">
				<template #submit>
					<div class="flex justify-center mt-4">
						<UButton type="submit" color="primary" class="w-1/2 flex justify-center items-center">
							Log in
						</UButton>
					</div>
				</template>

				<template #validation v-if="loginError">
					<UAlert color="error" icon="i-lucide-info" title="Invalid admin credentials" />
				</template>

				<template #footer> Authorized administrators only. </template>
			</UAuthForm>
		</UPageCard>
	</div>
</template>

<script
	setup
	lang="ts"
>
	import * as z from 'zod';
	import { ref } from 'vue';
	import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';
	import { useToast, navigateTo } from '#imports';

	const toast = useToast();
	const loginError = ref(false);

	const fields: AuthFormField[] = [
		{ name: 'email', type: 'email', label: 'Admin Email', placeholder: 'Enter admin email', required: true },
		{ name: 'password', type: 'password', label: 'Password', placeholder: 'Enter password', required: true },
	];

	const schema = z.object({
		email: z.string().email('Invalid email'),
		password: z.string().min(8, 'Must be at least 8 characters'),
	});

	type Schema = z.output<typeof schema>;

	function onSubmit(payload: FormSubmitEvent<Schema>) {
		const { email, password } = payload.data;
		if (email === 'admin@cpsu.edu' && password === 'admin1234') {
			toast.add({ title: 'Success', description: 'Logging in...' });
			navigateTo('/admin/dashboard');
		} else {
			loginError.value = true;
		}
	}
</script>
