<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from "@nuxt/ui";

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
	{ label: "Home", to: "/", icon: "i-lucide-book-open", active: route.path === "/" },
	{
		label: "About",
		to: "/about",
		icon: "i-lucide-box",
		active: route.path.startsWith("/about"),
	},
	{
		label: "Dashboard",
		to: "/approved-scholars",
		icon: "i-lucide-user",
		active: route.path.startsWith("/approved-scholars"),
	},
]);

const dropdownItems = ref<DropdownMenuItem[]>([
	{ label: "Contacts", icon: "i-lucide-user", to: "/contacts" },
	{ label: "Help", icon: "i-lucide-credit-card", to: "/help" },
	{ label: "Guidelines", icon: "i-lucide-cog", to: "/guidelines" },
]);
</script>

<template>
	<div>
		<!-- Shared Header -->
		<UHeader toggle-side="left">
			<template #title>
				<div class="flex items-center gap-2">
					<span class="font-semibold">CPSU Scholarship</span>
				</div>
			</template>

			<UNavigationMenu :items="items" />

			<template #right>
				<UColorModeButton />
				<div class="flex items-center gap-2">
					<UButton to="/login">Login</UButton>

					<UDropdownMenu
						:items="dropdownItems"
						:content="{ align: 'end' }"
					>
						<UButton
							icon="i-lucide-menu"
							color="neutral"
							variant="ghost"
						/>
					</UDropdownMenu>
				</div>
			</template>
		</UHeader>

		<!-- Page Content -->
		<main class="p-1">
			<slot />
		</main>
	</div>
</template>
