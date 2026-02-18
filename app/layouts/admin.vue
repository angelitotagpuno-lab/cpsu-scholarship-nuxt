<template>
	<div class="flex h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
		<!-- Sidebar -->
		<aside
			:class="[
				'transition-all duration-300 border-r border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 flex flex-col',
				open ? 'w-64' : 'w-16',
			]"
		>
			<!-- Logo & Title -->
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
					>Admin</span
				>
			</div>

			<!-- Navigation Items -->
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

			<!-- User Avatar / Logout -->
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
			<!-- Top Bar -->
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

			<!-- Page Content -->
			<div class="p-6 flex-1 overflow-auto space-y-6">
				<slot />
				<!-- Page content injected here -->
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { NavigationMenuItem } from "@nuxt/ui";

const open = ref(true);
const router = useRouter();
const route = useRoute();

/* Sidebar navigation items */
const items = computed<NavigationMenuItem[][]>(() => [
	[
		{
			label: "Home",
			icon: "i-lucide-house",
			to: "/admin/dashboard",
			active: route.path === "/admin/dashboard",
		},
		{
			label: "Files",
			icon: "i-lucide-inbox",
			badge: "",
			to: "/admin/files",
			active: route.path === "/admin/files",
		},
		{
			label: "Applicants",
			icon: "i-lucide-users",
			to: "/admin/applicants",
			active: route.path === "/admin/applicants",
		},
		{
			label: "Settings",
			icon: "i-lucide-settings",
			children: [
				{
					label: "General",
					to: "/settings/general",
					active: route.path === "/settings/general",
				},
				{
					label: "Members",
					to: "/settings/members",
					active: route.path === "/settings/members",
				},
				{
					label: "Notifications",
					to: "/settings/notifications",
					active: route.path === "/settings/notifications",
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
]);

/* Logout function */
function logout() {
	localStorage.removeItem("token");
	sessionStorage.clear();
	router.push("/");
}
</script>
