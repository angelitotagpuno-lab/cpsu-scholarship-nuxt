<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const items = computed(() => [
	{
		label: "Home",
		to: "/",
		icon: "i-lucide-book-open",
		active: route.path === "/",
	},
	{
		label: "About",
		to: "/about",
		icon: "i-lucide-box",
		active: route.path.startsWith("/about"),
	},
	{
		label: "Approved Scholars",
		to: "/approved-scholars",
		icon: "i-lucide-lightbulb",
		active: route.path.startsWith("/approved-scholars"),
	},
]);

const dropdownItems = [
	{ label: "Contacts", icon: "i-lucide-user", to: "/contacts" },
	{ label: "Help", icon: "i-lucide-credit-card", to: "/billing" },
	{ label: "Settings", icon: "i-lucide-cog", to: "/settings" },
];
</script>

<template>
	<u-header toggle-side="left">
		<template #title>
			<div class="flex items-center gap-2">
				<Logo class="h-6 w-auto" />
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
					:content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
					:ui="{ content: 'w-48' }"
				>
					<UButton
						icon="i-lucide-menu"
						color="neutral"
						variant="ghost"
					/>
				</UDropdownMenu>
			</div>
		</template>

		<template #body>
			<UNavigationMenu
				:items="items"
				orientation="vertical"
				class="-mx-2.5"
			/>
		</template>
	</u-header>
	<slot />
</template>
