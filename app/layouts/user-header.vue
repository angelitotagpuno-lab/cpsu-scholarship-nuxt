<script setup lang="ts">
import { ref, computed } from "vue";
import type { NavigationMenuItem, DropdownMenuItem } from "@nuxt/ui";

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
	{ label: "Home", to: "/user", icon: "i-lucide-book-open", active: route.path === "/user" },
	{
		label: "Applicant Portal",
		to: "/portal",
		icon: "i-lucide-box",
		active: route.path.startsWith("/portal"),
	},
	{
		label: "Applicant Liquidation",
		to: "/user/user-liquidation",
		icon: "i-lucide-user",
		active: route.path.startsWith("/user/user-liquidation"),
	},
]);

const dropdownItems = ref<DropdownMenuItem[]>([
	{ label: "Contacts", icon: "i-lucide-user", to: "/contacts" },
	{ label: "Help", icon: "i-lucide-credit-card", to: "/help" },
]);

const showMobileMenu = ref(false);
</script>

<template>
	<div class="relative flex flex-col min-h-screen">
		<!-- Header -->
		<UHeader toggle-side="left">
			<template #title>
				<div class="flex items-center gap-2">
					<span class="font-semibold text-sm sm:text-base">CPSU Scholarship</span>
				</div>
			</template>

			<!-- Desktop Navigation -->
			<div class="hidden sm:flex flex-1 overflow-x-auto">
				<UNavigationMenu
					:items="items"
					class="flex-nowrap"
				/>
			</div>

			<!-- Right Icons -->
			<template #right>
				<div class="flex items-center gap-2">
					<UColorModeButton />
					<!-- Mobile Hamburger -->
					<UButton
						icon="i-lucide-menu"
						color="neutral"
						variant="ghost"
						class="sm:hidden"
						@click="showMobileMenu = !showMobileMenu"
					/>
				</div>
			</template>
		</UHeader>

		<!-- Mobile Menu Overlay -->
		<transition name="fade">
			<div
				v-if="showMobileMenu"
				class="sm:hidden fixed inset-0 bg-white dark:bg-gray-800 z-50 overflow-y-auto"
			>
				<div class="p-4 flex flex-col gap-2">
					<ul class="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
						<li
							v-for="item in items"
							:key="item.label"
						>
							<NuxtLink
								:to="item.to"
								class="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold"
								@click="showMobileMenu = false"
							>
								<span class="flex items-center gap-2">
									<i :class="item.icon"></i>
									{{ item.label }}
								</span>
							</NuxtLink>
						</li>
						<li
							v-for="d in dropdownItems"
							:key="d.label"
						>
							<NuxtLink
								:to="d.to"
								class="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold"
								@click="showMobileMenu = false"
							>
								<span class="flex items-center gap-2">
									<i :class="d.icon"></i>
									{{ d.label }}
								</span>
							</NuxtLink>
						</li>
					</ul>
				</div>
			</div>
		</transition>

		<!-- Page Content -->
		<main class="flex-1 p-2 sm:p-4">
			<slot />
		</main>
	</div>
</template>

<style>
/* Fade transition for mobile menu */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* Hide scrollbar for desktop horizontal menu */
.sm:flex::-webkit-scrollbar {
	display: none;
}
.sm:flex {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>
