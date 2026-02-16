<script setup lang="ts">
	import * as z from 'zod';
	import { ref, computed } from 'vue';
	import type {
		FormSubmitEvent,
		AuthFormField,
		NavigationMenuItem,
		DropdownMenuItem,
	} from '@nuxt/ui';

	import { useRoute, navigateTo } from '#imports';

	const toast = useToast();
	const route = useRoute();

	const loginError = ref(false);

	const fields: AuthFormField[] = [
		{
			name: 'email',
			type: 'email',
			label: 'Admin Email',
			placeholder: 'Enter admin email',
			required: true,
		},
		{
			name: 'password',
			label: 'Password',
			type: 'password',
			placeholder: 'Enter password',
			required: true,
		},
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

	const items = computed<NavigationMenuItem[]>(() => [
		{
			label: 'Home',
			to: '/',
			icon: 'i-lucide-book-open',
			active: route.path === '/',
		},
		{
			label: 'About',
			to: '/docs/components',
			icon: 'i-lucide-box',
			active: route.path.startsWith('/docs/components'),
		},
	]);

	const dropdownItems = ref<DropdownMenuItem[]>([
		{ label: 'Contacts', icon: 'i-lucide-user', to: '/profile' },
		{ label: 'Help', icon: 'i-lucide-credit-card', to: '/billing' },
		{ label: 'Settings', icon: 'i-lucide-cog', to: '/settings' },
	]);
</script>

<template>
	<UHeader toggle-side="left">
		<template #title>
			<div class="flex items-center gap-2">
				<Logo class="h-6 w-auto" />
				<span class="font-semibold">CPSU Scholarship</span>
			</div>
		</template>

		<UNavigationMenu :items="items" />

		<template #right>
			<UColorModeButton />
			<div class="flex items-center gap-2">
				<UButton to="/login">Login</UButton>

				<UDropdownMenu
					:items="dropdownItems"
					:content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
					:ui="{ content: 'w-48' }">
					<UButton
						icon="i-lucide-menu"
						color="neutral"
						variant="ghost" />
				</UDropdownMenu>
			</div>
		</template>

		<template #body>
			<UNavigationMenu
				:items="items"
				orientation="vertical"
				class="-mx-2.5" />
		</template>
	</UHeader>

	<div class="flex flex-col items-center justify-center gap-4 p-4">
		<UPageCard class="w-full max-w-md">
			<UAuthForm
				:schema="schema"
				:fields="fields"
				title="Admin Login"
				icon="i-lucide-shield"
				submit-label="Log in"
				@submit="onSubmit">
				<template #submit>
					<div class="flex justify-center mt-4">
						<UButton
							type="submit"
							color="primary"
							class="w-1/2 flex justify-center items-center">
							Log in
						</UButton>
					</div>
				</template>

				<template
					#validation
					v-if="loginError">
					<UAlert
						color="error"
						icon="i-lucide-info"
						title="Invalid admin credentials" />
				</template>

				<template #footer> Authorized administrators only. </template>
			</UAuthForm>
		</UPageCard>
	</div>
</template>
