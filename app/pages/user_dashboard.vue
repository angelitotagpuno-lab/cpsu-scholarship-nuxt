<script
	setup
	lang="ts"
>
	import { ref, computed } from 'vue'
	import { useRoute } from 'vue-router'
	import type { NavigationMenuItem, DropdownMenuItem, ButtonProps, TableColumn } from '@nuxt/ui'

	// --- Current route ---
	const route = useRoute()

	// --- Header navigation items ---
	const items = computed<NavigationMenuItem[]>(() => [
		{ label: 'Home', to: '/', icon: 'i-lucide-book-open', active: route.path === '/' },
		{ label: 'About', to: '/about', icon: 'i-lucide-box', active: route.path.startsWith('/about') },
		{ label: 'Approved Scholars', to: '/user_dashboard', icon: 'i-lucide-lightbulb', active: route.path.startsWith('/user_dashboard') }
	])

	// --- Dropdown menu ---
	const dropdownItems: DropdownMenuItem[] = [
		{ label: 'Contacts', icon: 'i-lucide-user', to: '/profile' },
		{ label: 'Help', icon: 'i-lucide-credit-card', to: '/billing' },
		{ label: 'Settings', icon: 'i-lucide-cog', to: '/settings' }
	]


	// --- Approved Applicants Table ---
	const approvedApplicants = ref([
		{ id: 1, name: 'Juan Dela Cruz' },
		{ id: 2, name: 'Maria Santos' },
		{ id: 3, name: 'Pedro Reyes' }
	])

	const columns: TableColumn<{ id: number; name: string }>[] = [
		{ accessorKey: 'name', header: 'Approved Scholar Names' }
	]
</script>

<template>
	<div class="flex flex-col h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
		<!-- Header -->
		<UHeader toggle-side="left">
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


		<!-- Approved Scholars Table -->
		<div class="p-6">
			<h2 class="text-lg font-semibold mb-4">Approved Scholars</h2>
			<UTable :data="approvedApplicants" :columns="columns" sticky class="w-full" />
		</div>
	</div>
</template>
