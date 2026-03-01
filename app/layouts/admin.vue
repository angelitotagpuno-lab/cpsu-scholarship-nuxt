<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { NavigationMenuItem } from "@nuxt/ui";

const open = ref(true);
const router = useRouter();
const route = useRoute();
const store = useAuthStore();

// Logout function
async function logout() {
	await store.logout();
	router.push("/login");
}

// Navigation items
const items: NavigationMenuItem[][] = [
	[
		{ label: "Home", icon: "i-lucide-house", to: "/admin/home" },
		{ label: "Dashboard", icon: "i-lucide-inbox", to: "/admin/applicants" },
		{ label: "Files", icon: "i-lucide-table", to: "/admin/files" },
		{ label: "Scholars", icon: "i-lucide-users", to: "/admin/scholars" },
		{ label: "Help", icon: "i-lucide-book", to: "/admin/help" },
	],
];

// Reactive highlight
const reactiveItems = computed(() =>
	items.map((group) =>
		group.map((item) => ({
			...item,
			active: route.path === item.to,
		})),
	),
);
</script>

<template>
	<UDashboardGroup class="h-screen">
		<UDashboardSidebar
			:collapsed="!open"
			collapsible
			resizable
			class="overflow-y-auto"
			:ui="{ footer: 'border-t border-default' }"
		>
			<template #header="{ collapsed }">
				<div class="flex flex-col items-center justify-center w-full p-2">
					<h1
						v-if="!collapsed"
						class="text-lg font-bold text-center tracking-wider"
					>
						Admin Panel
					</h1>
				</div>
			</template>

			<!-- Navigation + Color Mode -->
			<template #default="{ collapsed }">
				<div class="flex flex-col h-full justify-between">
					<UNavigationMenu
						:collapsed="collapsed"
						:items="reactiveItems[0]"
						orientation="vertical"
					/>

					<div
						class="mt-4 px-2"
						v-if="!collapsed"
					>
						<UColorModeButton class="w-full" />
					</div>
				</div>
			</template>
			<!-- Footer -->
			<template #footer="{ collapsed }">
				<UButton
					:avatar="{ src: 'https://github.com/benjamincanac.png' }"
					:label="collapsed ? undefined : 'Logout'"
					color="neutral"
					variant="ghost"
					class="w-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-red-600 cursor-pointer"
					:block="collapsed"
					@click="logout"
				/>
			</template>
		</UDashboardSidebar>

		<UDashboardPanel class="flex flex-col overflow-hidden">
			<div class="flex-1 overflow-y-auto p-6 space-y-6">
				<slot />
			</div>
		</UDashboardPanel>
	</UDashboardGroup>
</template>
