<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { NavigationMenuItem } from "@nuxt/ui";

const open = ref(true);
const router = useRouter();
const route = useRoute();

// const items = computed<NavigationMenuItem[][]>(() => [
// 	[
// 		{
// 			label: "Home",
// 			icon: "i-lucide-house",
// 			to: "/admin/home",
// 			active: route.path === "/admin/home",
// 		},
// 		{
// 			label: "Dashboard",
// 			icon: "i-lucide-inbox",
// 			to: "/admin/dashboard",
// 			active: route.path === "/admin/dashboard",
// 		},
// 		{
// 			label: "Files",
// 			icon: "i-lucide-table",
// 			badge: "",
// 			to: "/admin/files",
// 			active: route.path === "/admin/files",
// 		},
// 		{
// 			label: "Applicants",
// 			icon: "i-lucide-users",
// 			to: "/admin/applicants",
// 			active: route.path === "/admin/applicants",
// 		},
// 		{
// 			label: "Help",
// 			icon: "i-lucide-book",
// 			to: "/admin/help",
// 			active: route.path === "/admin/help",
// 		},
// 	],
// ]);

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
			active: true,
		},
		{
			label: "Inbox",
			icon: "i-lucide-inbox",
			badge: "4",
		},
		{
			label: "Contacts",
			icon: "i-lucide-users",
		},
		{
			label: "Settings",
			icon: "i-lucide-settings",
			defaultOpen: true,
			children: [
				{
					label: "General",
				},
				{
					label: "Members",
				},
				{
					label: "Notifications",
				},
			],
		},
	],
	[
		{
			label: "Feedback",
			icon: "i-lucide-message-circle",
			to: "https://github.com/nuxt-ui-templates/dashboard",
			target: "_blank",
		},
		{
			label: "Help & Support",
			icon: "i-lucide-info",
			to: "https://github.com/nuxt/ui",
			target: "_blank",
		},
	],
];
</script>

<!-- <template>
	<div class="flex h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
		<aside
			:class="[
				'transition-all duration-300 border-r border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 flex flex-col',
				open ? 'w-64' : 'w-16',
			]"
		>
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
				>
					Admin
				</span>
			</div>

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

		<div class="flex flex-col">
			<div
				class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800"
			>
				<div class="flex items-center gap-2">
					<UButton
						icon="i-lucide-menu"
						variant="ghost"
						@click="open = !open"
					/>
					<slot name="page-title">
						<h1 class="font-semibold">Admin Dashboard</h1>
					</slot>
				</div>
				<UColorModeButton />
			</div>

			<div class="p-6">
				<slot />
			</div>
		</div>
	</div>
</template> -->

<template>
	<UDashboardGroup>
		<UDashboardSidebar
			collapsible
			resizable
			:ui="{ footer: 'border-t border-default' }"
		>
			<template #header="{ collapsed }">
				<Logo
					v-if="!collapsed"
					class="h-5 w-auto shrink-0"
				/>
				<UIcon
					v-else
					name="i-simple-icons-nuxtdotjs"
					class="size-5 text-primary mx-auto"
				/>
			</template>

			<template #default="{ collapsed }">
				<UButton
					:label="collapsed ? undefined : 'Search...'"
					icon="i-lucide-search"
					color="neutral"
					variant="outline"
					block
					:square="collapsed"
				>
					<template
						v-if="!collapsed"
						#trailing
					>
						<div class="flex items-center gap-0.5 ms-auto">
							<UKbd
								value="meta"
								variant="subtle"
							/>
							<UKbd
								value="K"
								variant="subtle"
							/>
						</div>
					</template>
				</UButton>

				<UNavigationMenu
					:collapsed="collapsed"
					:items="items[0]"
					orientation="vertical"
				/>

				<UNavigationMenu
					:collapsed="collapsed"
					:items="items[1]"
					orientation="vertical"
					class="mt-auto"
				/>
			</template>

			<template #footer="{ collapsed }">
				<UButton
					:avatar="{
						src: 'https://github.com/benjamincanac.png',
					}"
					:label="collapsed ? undefined : 'Benjamin'"
					color="neutral"
					variant="ghost"
					class="w-full"
					:block="collapsed"
				/>
			</template>
		</UDashboardSidebar>

		<slot />
	</UDashboardGroup>
</template>
