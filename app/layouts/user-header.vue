<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { NavigationMenuItem } from "@nuxt/ui";
import { useAuthStore } from "~/stores/auth.store";
import { index } from "~/services/student.service";

const route = useRoute();
const router = useRouter();
const store = useAuthStore();

const showMobileMenu = ref(false);

// logout
async function logout() {
	const confirmLogout = confirm("Are you sure you want to logout?");
	if (!confirmLogout) return;

	try {
		await store.logout();
		showMobileMenu.value = false;
		router.push("/user-login");
	} catch (error) {
		console.error("Logout failed", error);
		alert("Logout failed. Please try again.");
	}
}

// Desktop menu items (Nuxt UI compatible)
const items = computed<NavigationMenuItem[]>(() => [
	{
		label: "Home",
		to: "/user",
		active: route.path === "/user",
		icon: "i-lucide-book-open",
	},
	{
		label: "Scholarship Application",
		icon: "i-lucide-box",
		type: "trigger",
		defaultOpen: route.path.startsWith("/user/portal"),
		children: [
			{
				label: "TDP",
				to: "/user/portal/tdp",
				icon: "i-lucide-file-text",
				active: route.path === "/user/portal/tdp",
			},
			{
				label: "TES",
				to: "/user/portal/tes",
				icon: "i-lucide-file-text",
				active: route.path === "/user/portal/tes",
			},
		],
	},
	{
		label: "Scholarship Payout",
		to: "/user/user-liquidation",
		icon: "i-lucide-user",
		active: route.path.startsWith("/user/user-liquidation"),
	},
]);

// Mobile dropdown state
const mobileOpen = reactive<Record<string, boolean>>({});

// safe toggle helper (prevents TS issues)
function toggleMenu(label?: string) {
	if (!label) return;
	mobileOpen[label] = !mobileOpen[label];
}
</script>

<template>
	<div class="relative flex flex-col min-h-screen">
		<!-- Header -->
		<UHeader toggle-side="left">
			<template #title>
				<div class="flex items-center gap-2">
					<!-- Logo -->
					<NuxtImg
						src="/ai-logo.png"
						alt="CPSU Logo"
						width="38"
						height="38"
						class="object-contain"
					/>

					<!-- Title -->
					<div class="font-semibold text-sm sm:text-base">CPSU Scholarship</div>
				</div>
			</template>

			<!-- Desktop Navigation -->
			<div class="hidden sm:flex flex-1">
				<UNavigationMenu :items="items" />
			</div>

			<!-- Right Side -->
			<template #right>
				<UColorModeButton />

				<!-- Logout (Desktop) -->
				<UButton
					label="Logout"
					icon="i-lucide-log-out"
					color="error"
					variant="ghost"
					class="hidden sm:inline-flex"
					@click="logout"
				/>

				<!-- Mobile Menu Button -->
				<UButton
					icon="i-lucide-menu"
					color="neutral"
					variant="ghost"
					class="sm:hidden"
					@click="showMobileMenu = !showMobileMenu"
				/>
			</template>
		</UHeader>

		<!-- Mobile Menu -->
		<transition name="fade">
			<div
				v-if="showMobileMenu"
				class="sm:hidden fixed inset-0 bg-white dark:bg-gray-800 z-50 overflow-y-auto"
			>
				<div class="p-4 flex flex-col gap-2">
					<ul class="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
						<li
							v-for="item in items"
							:key="item.label || item.to || item.icon || index"
						>
							<!-- Parent with children -->
							<button
								v-if="item.children"
								class="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold flex items-center justify-between"
								@click="toggleMenu(item.label)"
							>
								<span class="flex items-center gap-2">
									<i :class="item.icon"></i> {{ item.label }}
								</span>

								<i
									class="i-lucide-chevron-down transition-transform duration-200"
									:class="{
										'rotate-180': item.label && mobileOpen[item.label],
									}"
								></i>
							</button>

							<!-- Parent without children -->
							<NuxtLink
								v-else
								:to="item.to"
								class="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold"
								@click="showMobileMenu = false"
							>
								<span class="flex items-center gap-2">
									<i :class="item.icon"></i> {{ item.label }}
								</span>
							</NuxtLink>

							<!-- Children -->
							<transition name="slide-fade">
								<div
									v-if="item.children && item.label && mobileOpen[item.label]"
									class="flex flex-col pl-8"
								>
									<NuxtLink
										v-for="child in item.children"
										:key="child.label"
										:to="child.to"
										class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
										@click="showMobileMenu = false"
									>
										{{ child.label }}
									</NuxtLink>
								</div>
							</transition>
						</li>
					</ul>

					<!-- Logout (Mobile) -->
					<div class="mt-6 border-t pt-4">
						<UButton
							label="Logout"
							icon="i-lucide-log-out"
							color="error"
							variant="solid"
							block
							@click="logout"
						/>
					</div>
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
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: all 0.2s ease;
}
.slide-fade-enter-from {
	opacity: 0;
	transform: translateY(-5px);
}
.slide-fade-leave-to {
	opacity: 0;
	transform: translateY(-5px);
}
</style>
