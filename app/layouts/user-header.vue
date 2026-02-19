<script setup lang="ts">
import { ref } from "vue";
import type { NavigationMenuItem } from "@nuxt/ui";

const collapsed = ref(false);

const items: NavigationMenuItem[] = [
	{ label: "Dashboard", icon: "i-lucide-house", to: "/user/approved-scholars" },
	{ label: "Contacts", icon: "i-lucide-users", to: "/user/contacts" },
	{ label: "Guide", icon: "i-lucide-book", to: "/user/guidelines" },
	{ label: "Help", icon: "i-lucide-credit-card", to: "/user/help" },
	{ label: "Info", icon: "i-lucide-cog", to: "/user/info" },
];
</script>

<template>
	<div class="flex min-h-screen">
		<!-- Sidebar -->
		<UDashboardSidebar
			v-model:collapsed="collapsed"
			collapsible
		>
			<!-- ✅ FULL GREEN HEADER (NO GAPS) -->
			<template #header>
				<div class="relative h-16">
					<div class="absolute inset-0 bg-[#0B5D3B]"></div>
				</div>
			</template>

			<UNavigationMenu
				:collapsed="collapsed"
				:items="items"
				orientation="vertical"
			/>
		</UDashboardSidebar>

		<!-- Main Content -->
		<div class="flex-1 flex flex-col">
			<!-- Top Header -->
			<UHeader>
				<template #title>
					<span class="font-semibold">CPSU Scholarship Dashboard</span>
				</template>

				<template #right>
					<UColorModeButton />
				</template>
			</UHeader>

			<!-- Page Content -->
			<main class="p-6">
				<slot />
			</main>
		</div>
	</div>
</template>
