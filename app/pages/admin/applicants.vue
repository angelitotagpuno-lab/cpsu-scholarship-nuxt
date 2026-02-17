<script
	setup
	lang="ts"
>
	import type { NavigationMenuItem } from '@nuxt/ui'
	import { useRoute, useRouter } from 'vue-router'
	import { ref, computed } from 'vue'

	const open = ref(true)
	const router = useRouter()
	const route = useRoute()
	const value = ref<File[]>([])

	// Reactive navigation items
	const items: NavigationMenuItem[][] = computed(() => [[
		{
			label: 'Home',
			icon: 'i-lucide-house',
			to: '/admin/dashboard',
			active: route.path === '/admin/dashboard',
		},
		{
			label: 'Files',
			icon: 'i-lucide-inbox',
			badge: '',
			to: '/admin/files',
			active: route.path === '/admin/files',
		},
		{
			label: 'Applicants',
			icon: 'i-lucide-users',
			to: '/admin/applicants',
			active: route.path === '/admin/applicants',
		},
		{
			label: 'Settings',
			icon: 'i-lucide-settings',
			children: [
				{ label: 'General', to: '/settings/general', active: route.path === '/settings/general' },
				{ label: 'Members', to: '/settings/members', active: route.path === '/settings/members' },
				{ label: 'Notifications', to: '/settings/notifications', active: route.path === '/settings/notifications' },
			],
		},
	], [
		{ label: 'Feedback', icon: 'i-lucide-message-circle', to: 'https://github.com/nuxt-ui-templates/dashboard', target: '_blank' },
		{ label: 'Help & Support', icon: 'i-lucide-info', to: 'https://github.com/nuxt/ui', target: '_blank' },
	]])

	// Logout
	function logout() {
		localStorage.removeItem('token')
		sessionStorage.clear()
		router.push('/')
	}
</script>

<template>
	<div class="flex h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
<!-- Sidebar -->
		<aside
:class="[
			'transition-all duration-300 border-r border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 flex flex-col',
			open ? 'w-64' : 'w-16',
		]"
>
			<!-- Logo -->
			<div
				class="flex flex-col items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800 overflow-hidden px-2"
>
				<img
src="/logo.png"
alt="Admin Logo"
class="transition-all duration-300 rounded-full object-cover h-12 w-12"
/>
				<span
v-if="open"
class="text-xs font-semibold mt-2 mb-1 truncate text-center"
>Admin</span>
			</div>

			<!-- Navigation -->
			<div class="flex-1 p-2 space-y-2 overflow-y-auto">
				<UNavigationMenu
:collapsed="!open"
:items="items[0]"
orientation="vertical"
/>
				<UNavigationMenu
:collapsed="!open"
:items="items[1]"
orientation="vertical"
class="mt-auto"
/>
			</div>

			<!-- Footer -->
			<div class="p-2 border-t border-gray-200 dark:border-gray-800">
				<UButton
:avatar="{ src: 'https://github.com/benjamincanac.png' }"
:label="open ? 'Benjamin' : undefined"
					color="neutral"
variant="ghost"
class="w-full"
:square="!open"
@click="logout"
/>
			</div>
		</aside>

		<!-- Main Content -->
		<div class="flex-1 flex flex-col">
			<!-- Top Navbar -->
			<div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
				<div class="flex items-center gap-2">
					<UButton
icon="i-lucide-menu"
variant="ghost"
@click="open = !open"
/>
					<h1 class="font-semibold">CPSU Scholarship Dashboard</h1>
				</div>
				<UColorModeButton />
			</div>
</div>
</div>
</template>
