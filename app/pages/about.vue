<script
	setup
	lang="ts"
>
	import { ref, computed } from 'vue'
	import { useRoute } from 'vue-router'
	import type { PageFeatureProps } from '@nuxt/ui'

	// --- Current route ---
	const route = useRoute()

	// --- Header navigation items ---
	const items = computed(() => [
		{
			label: 'Home',
			to: '/',
			icon: 'i-lucide-book-open',
			active: route.path === '/' // highlight when at Home
		},
		{
			label: 'About',
			to: '/about',
			icon: 'i-lucide-box',
			active: route.path.startsWith('/about') // highlight when on About or its subpages
		},
		{
			label: 'Approved Scholars',
			to: '/user_dashboard',
			icon: 'i-lucide-lightbulb',
			active: route.path.startsWith('/user_dashboard') // highlight when on About or its subpages
		}
	])

	// --- Dropdown menu ---
	const dropdownItems = [
		{ label: 'Contacts', icon: 'i-lucide-user', to: '/profile' },
		{ label: 'Help', icon: 'i-lucide-credit-card', to: '/billing' },
		{ label: 'Settings', icon: 'i-lucide-cog', to: '/settings' }
	]
	const features = ref<PageFeatureProps[]>([
		{
			title: 'Icons',
			description: 'Nuxt UI integrates with Nuxt Icon to access over 200,000+ icons from Iconify.',
			icon: 'i-lucide-smile',
			to: ''
		},
		{
			title: 'Fonts',
			description: 'Nuxt UI integrates with Nuxt Fonts to provide plug-and-play font optimization.',
			icon: 'i-lucide-a-large-small',
			to: ''
		},
		{
			title: 'Color Mode',
			description: 'Nuxt UI integrates with Nuxt Color Mode to switch between light and dark.',
			icon: 'i-lucide-sun-moon',
			to: ''
		}
	])
</script>

<template>
	<UHeader toggle-side="left">
		<!-- Header Title -->
		<template #title>
			<div class="flex items-center gap-2">
				<Logo class="h-6 w-auto" />
				<span class="font-semibold">CPSU Scholarship</span>
			</div>
		</template>

		<!-- Horizontal Navigation -->
		<UNavigationMenu :items="items" />

		<!-- Right Side -->
		<template #right>
			<UColorModeButton />
			<div class="flex items-center gap-2">
				<UButton to="/login">Login</UButton>

				<UDropdownMenu :items="dropdownItems" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
					:ui="{ content: 'w-48' }">
					<UButton icon="i-lucide-menu" color="neutral" variant="ghost" />
				</UDropdownMenu>
			</div>
		</template>

		<!-- Vertical Sidebar Menu -->
		<template #body>
			<UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
		</template>
	</UHeader>

	<template>
		<UPageSection title="Beautiful Vue UI components"
			description="Nuxt UI provides a comprehensive suite of components and utilities to help you build beautiful and accessible web applications with Vue and Nuxt."
			:features="features" />
	</template>

</template>
