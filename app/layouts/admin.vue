<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { NavigationMenuItem } from "@nuxt/ui";

const open = ref(true);
const router = useRouter();
const route = useRoute();
const store = useAuthStore();

async function logout() {
	await store.logout();
	router.push("/user-login");
}

// Sidebar navigation items
const items: NavigationMenuItem[][] = [
	[
		{ label: "Dashboard", icon: "i-lucide-house", to: "/admin/home" },
		{ label: "Courses", icon: "i-lucide-lightbulb", to: "/admin/courses" },

		// Applicants with TDP/TES
		{
			label: "Applicants",
			icon: "i-lucide-inbox",
			type: "trigger",
			defaultOpen: true,
			children: [
				{ label: "TDP Applicants", to: "/admin/applicants/tdp" },
				{ label: "TES Applicants", to: "/admin/applicants/tes" },
			],
		},

		{ label: "Files", icon: "i-lucide-table", to: "/admin/files" },

		// Scholars with TDP/TES
		{
			label: "Scholars",
			icon: "i-lucide-users",
			type: "trigger",
			children: [
				{ label: "TDP Scholars", to: "/admin/scholars/tdp" },
				{ label: "TES Scholars", to: "/admin/scholars/tes" },
			],
		},

		// Liquidation with TDP/TES
		{
			label: "Liquidation Records",
			icon: "i-lucide-book",
			type: "trigger",
			children: [
				{ label: "TDP", to: "/admin/liquidation/tdp" },
				{ label: "TES", to: "/admin/liquidation/tes" },
			],
		},
	],
];

// Reactive highlighting (parent & child)
const reactiveItems = computed(() =>
	items.map((group) =>
		group.map((item) => {
			const isActive = route.path === item.to;

			// Handle children
			let children;
			let hasActiveChild = false;
			if (item.children) {
				children = item.children.map((child) => {
					const childActive = route.path === child.to;
					if (childActive) hasActiveChild = true;
					return { ...child, active: childActive };
				});
			}

			return {
				...item,
				active: isActive || hasActiveChild,
				defaultOpen: item.type === "trigger" ? hasActiveChild || item.defaultOpen : undefined,
				children,
			};
		}),
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
			<!-- Sidebar header -->
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
