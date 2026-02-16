<script setup lang="ts">
	import type {
		NavigationMenuItem,
		DropdownMenuItem,
		ButtonProps,
	} from '@nuxt/ui';

	const route = useRoute();

	const items = computed<NavigationMenuItem[]>(() => [
		{
			label: 'Home',
			to: '/',
			icon: 'i-lucide-book-open',
			active: route.path.startsWith('/'),
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

	const links = ref<ButtonProps[]>([
		{
			label: 'Approved Scholars',
			to: '/docs/getting-started',
			icon: 'i-lucide-square-play',
		},
		{
			label: 'Learn more',
			to: '/docs/getting-started/theme/design-system',
			color: 'neutral',
			variant: 'subtle',
			trailingIcon: 'i-lucide-arrow-right',
		},
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

	<UPageHero
		title="CPSU Scholarship"
		description="Track your application status and get a scholarship!"
		headline="Now Approved Applicants"
		orientation="horizontal"
		:links="links">
		<img
			src=""
			alt="Scholarship img"
			class="rounded-lg shadow-2xl ring ring-default" />
	</UPageHero>
</template>
