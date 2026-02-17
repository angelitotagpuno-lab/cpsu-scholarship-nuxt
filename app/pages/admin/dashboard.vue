<script
	setup
	lang="ts"
>
	import type { NavigationMenuItem, TableColumn } from '@nuxt/ui'
	import { ref, computed } from 'vue'
	import { useRoute, useRouter } from 'vue-router'

	/* Sidebar state */
	const open = ref(true)
	const router = useRouter()
	const route = useRoute()

	/* Sidebar navigation items */
	const items: NavigationMenuItem[][] = computed(() => [[
		{ label: 'Home', icon: 'i-lucide-house', to: '/admin/dashboard', active: route.path === '/admin/dashboard' },
		{ label: 'Files', icon: 'i-lucide-inbox', badge: '', to: '/admin/files', active: route.path === '/admin/files' },
		{ label: 'Applicants', icon: 'i-lucide-users', to: '/admin/applicants', active: route.path === '/admin/applicants' },
		{
			label: 'Settings', icon: 'i-lucide-settings', children: [
				{ label: 'General', to: '/settings/general', active: route.path === '/settings/general' },
				{ label: 'Members', to: '/settings/members', active: route.path === '/settings/members' },
				{ label: 'Notifications', to: '/settings/notifications', active: route.path === '/settings/notifications' },
			]
		}
	], [
		{ label: 'Feedback', icon: 'i-lucide-message-circle', to: 'https://github.com/nuxt-ui-templates/dashboard', target: '_blank' },
		{ label: 'Help & Support', icon: 'i-lucide-info', to: 'https://github.com/nuxt/ui', target: '_blank' }
	]])

	/* Logout function */
	function logout() {
		localStorage.removeItem('token')
		sessionStorage.clear()
		router.push('/')
	}

	/* ---------------- Applicants Table ---------------- */
	type Applicant = {
		id: number
		name: string
		email: string
		income: number
		gpa: number
		eligibility: string
	}

	const applicants = ref<Applicant[]>([
		{ id: 1, name: 'Juan Dela Cruz', email: 'juan@example.com', income: 20000, gpa: 3.75, eligibility: 'Eligible' },
		{ id: 2, name: 'Maria Santos', email: 'maria@example.com', income: 15000, gpa: 3.90, eligibility: 'Eligible' },
		{ id: 3, name: 'Pedro Reyes', email: 'pedro@example.com', income: 10000, gpa: 2.80, eligibility: 'Not Eligible' }
	])

	const columns: TableColumn<Applicant>[] = [
		{ accessorKey: 'name', header: 'Name' },
		{ accessorKey: 'email', header: 'Email' },
		{ accessorKey: 'income', header: 'Income' },
		{ accessorKey: 'gpa', header: 'GPA' },
		{ accessorKey: 'eligibility', header: 'Eligibility' }
	]

	/* ---------------- Add Applicant Inline Form ---------------- */
	const showForm = ref(false)
	const newApplicant = ref<Applicant>({
		id: 0,
		name: '',
		email: '',
		income: 0,
		gpa: 0,
		eligibility: 'Eligible'
	})

	function openForm() {
		newApplicant.value = {
			id: applicants.value.length + 1,
			name: '',
			email: '',
			income: 0,
			gpa: 0,
			eligibility: 'Eligible'
		}
		showForm.value = true
	}

	function addApplicant() {
		if (!newApplicant.value.name || !newApplicant.value.email) return
		applicants.value.unshift({ ...newApplicant.value })
		showForm.value = false
	}
</script>

<template>
	<div class="flex h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

		<!-- Sidebar -->
		<aside
			:class="['transition-all duration-300 border-r border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 flex flex-col', open ? 'w-64' : 'w-16']">
			<div
				class="flex flex-col items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800 overflow-hidden px-2">
				<img src="/logo.png" alt="Admin Logo" class="transition-all duration-300 rounded-full object-cover h-12 w-12" />
				<span v-if="open" class="text-xs font-semibold mt-2 mb-1 truncate text-center">Admin</span>
			</div>
			<div class="flex-1 p-2 space-y-2 overflow-y-auto">
				<UNavigationMenu :collapsed="!open" :items="items[0]" orientation="vertical" />
				<UNavigationMenu :collapsed="!open" :items="items[1]" orientation="vertical" class="mt-auto" />
			</div>
			<div class="p-2 border-t border-gray-200 dark:border-gray-800">
				<UButton :avatar="{ src: 'https://github.com/benjamincanac.png' }" :label="open ? 'Benjamin' : undefined"
					color="neutral" variant="ghost" class="w-full" :square="!open" @click="logout" />
			</div>
		</aside>

		<!-- Main Content -->
		<div class="flex-1 flex flex-col">
			<div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
				<div class="flex items-center gap-2">
					<UButton icon="i-lucide-menu" variant="ghost" @click="open = !open" />
					<h1 class="font-semibold">CPSU Scholarship Dashboard</h1>
				</div>
				<UColorModeButton />
			</div>

			<div class="p-6 flex-1 overflow-auto space-y-6">

				<!-- Top Row: Page Hero / Blog Post + Add Applicant Button -->
				<div class="flex flex-col lg:flex-row gap-6 mb-4">

					<!-- Left: Page Hero / Blog -->
					<div class="flex-1">
						<UBlogPost title="Introducing Nuxt Icon v1"
							description="Discover Nuxt Icon v1 - a modern, versatile, and customizable icon solution for your Nuxt projects." />
					</div>

					<!-- Right: Add Applicant -->
					<div class="flex-1 lg:max-w-sm">
						<UButton label="Add Applicant" icon="i-lucide-plus" color="green" variant="outline" class="w-full"
							@click="openForm" />

						<div v-if="showForm" class="p-4 border rounded-md bg-gray-50 dark:bg-gray-900 space-y-3 mt-2">
							<UInput v-model="newApplicant.name" label="Name" placeholder="Enter full name" />
							<UInput v-model="newApplicant.email" label="Email" placeholder="Enter email" />
							<UInput v-model.number="newApplicant.income" label="Income" type="number" placeholder="Enter income" />
							<UInput v-model.number="newApplicant.gpa" label="GPA" type="number" step="0.01" placeholder="Enter GPA" />
							<USelect v-model="newApplicant.eligibility" label="Eligibility" :options="['Eligible', 'Not Eligible']" />

							<div class="flex justify-end gap-2">
								<UButton label="Cancel" variant="outline" color="neutral" @click="showForm = false" />
								<UButton label="Add" color="green" @click="addApplicant" />
							</div>
						</div>
					</div>
				</div>

				<!-- Applicants Table (Full Width) -->
				<UTable :data="applicants" :columns="columns" sticky class="flex-1 h-[600px] w-full" />

			</div>
		</div>
	</div>
</template>
