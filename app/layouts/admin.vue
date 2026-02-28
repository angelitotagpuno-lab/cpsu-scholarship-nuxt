<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { NavigationMenuItem } from "@nuxt/ui";

const open = ref(true);
const router = useRouter();
const route = useRoute();

function logout() {
	localStorage.removeItem("token");
	sessionStorage.clear();
	router.push("/");
}

const items: NavigationMenuItem[][] = [
	[
		{
			label: "Home",
			icon: "i-lucide-house",
			to: "/admin/home",
			active: route.path === "/admin/home",
		},
		{
			label: "Dashboard",
			icon: "i-lucide-inbox",
			to: "/admin/dashboard",
			active: route.path === "/admin/dashboard",
		},
		{
			label: "Files",
			icon: "i-lucide-table",
			to: "/admin/files",
			active: route.path === "/admin/files",
		},
		{
			label: "Scholars",
			icon: "i-lucide-users",
			to: "/admin/scholars",
			active: route.path === "/admin/scholars",
		},
		{
			label: "Help",
			icon: "i-lucide-book",
			to: "/admin/help",
			active: route.path === "/admin/help",
		},
	],
];
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
					<button
						class="mt-3 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 mb-2"
						@click="open = !open"
					>
						<UIcon
							name="i-lucide-menu"
							class="size-5"
						/>
					</button>

					<!-- Title with letter & word spacing -->
					<h1
						v-if="!collapsed"
						class="text-lg font-bold text-center tracking-wider"
					>
						Admin Panel
					</h1>
				</div>
			</template>

			<!-- Navigation -->
			<template #default="{ collapsed }">
				<UNavigationMenu
					:collapsed="collapsed"
					:items="items[0]"
					orientation="vertical"
				/>
			</template>

			<!-- Footer -->
			<template #footer="{ collapsed }">
				<UButton
					:avatar="{ src: 'https://github.com/benjamincanac.png' }"
					:label="collapsed ? undefined : 'Benjamin'"
					color="neutral"
					variant="ghost"
					class="w-full"
					:block="collapsed"
				/>
			</template>
		</UDashboardSidebar>
		<UDashboardPanel class="flex flex-col overflow-hidden">
			<template #header>
				<UDashboardNavbar title="Admin Dashboard">
					<template #right>
						<UButton
							color="primary"
							variant="solid"
						>
							Action
						</UButton>
					</template>
				</UDashboardNavbar>
			</template>

			<div class="flex-1 overflow-y-auto p-6 space-y-6">
				<div class="flex items-center justify-between border-b pb-4">
					<h1 class="text-xl font-semibold">Eligibility Scholarship System</h1>

					<UColorModeButton />
				</div>
				<slot />
			</div>
		</UDashboardPanel>
	</UDashboardGroup>
</template>
