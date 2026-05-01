<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { NavigationMenuItem } from "@nuxt/ui";

const open = ref(true);
const showLogoutModal = ref(false);

const router = useRouter();
const route = useRoute();
const store = useAuthStore();

async function logout() {
	await store.logout();
	router.push("/user-login");
}

function openLogoutConfirm() {
	showLogoutModal.value = true;
}

async function confirmLogout() {
	showLogoutModal.value = false;
	await logout();
}

const items: NavigationMenuItem[][] = [
	[
		{ label: "Dashboard", icon: "i-lucide-layout-dashboard", to: "/admin/home" },
		{ label: "Personnel", icon: "i-lucide-id-card", to: "/admin/personnel" },
		{ label: "Students", icon: "i-lucide-graduation-cap", to: "/admin/students" },
		{ label: "Courses", icon: "i-lucide-book-open", to: "/admin/courses" },
		{
			label: "Applicants",
			icon: "i-lucide-clipboard-list",
			type: "trigger",
			defaultOpen: true,
			children: [
				{ label: "TDP Applicants", icon: "i-lucide-file-user", to: "/admin/applicants/tdp" },
				{ label: "TES Applicants", icon: "i-lucide-file-check-2", to: "/admin/applicants/tes" },
			],
		},
		{ label: "Files", icon: "i-lucide-folder-open", to: "/admin/files" },
		{
			label: "Scholars",
			icon: "i-lucide-award",
			type: "trigger",
			children: [
				{ label: "TDP Scholars", icon: "i-lucide-medal", to: "/admin/scholars/tdp" },
				{ label: "TES Scholars", icon: "i-lucide-trophy", to: "/admin/scholars/tes" },
			],
		},
		{
			label: "Liquidation Records",
			icon: "i-lucide-receipt-text",
			type: "trigger",
			children: [
				{ label: "TDP", icon: "i-lucide-file-spreadsheet", to: "/admin/liquidation/tdp" },
				{ label: "TES", icon: "i-lucide-file-text", to: "/admin/liquidation/tes" },
			],
		},
	],
];

const reactiveItems = computed(() =>
	items.map((group) =>
		group.map((item) => {
			const isActive = route.path === item.to;

			let children;
			let hasActiveChild = false;

			if (item.children) {
				children = item.children.map((child) => {
					const childActive = route.path === child.to;

					if (childActive) {
						hasActiveChild = true;
					}

					return {
						...child,
						active: childActive,
					};
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
	<UDashboardGroup class="h-screen bg-slate-50 dark:bg-slate-950">
		<UDashboardSidebar
			:collapsed="!open"
			collapsible
			resizable
			class="overflow-y-auto bg-white dark:bg-slate-900"
			:ui="{
				root: 'border-r border-slate-200 dark:border-slate-800',
				header: 'border-b border-slate-200 dark:border-slate-800',
				footer: 'border-t border-slate-200 dark:border-slate-800',
			}"
		>
			<template #header="{ collapsed }">
				<div class="flex w-full items-center justify-center p-3">
					<div
						v-if="!collapsed"
						class="flex items-center gap-2"
					>
						<div class="rounded-md bg-emerald-600 p-2 text-white">
							<UIcon
								name="i-lucide-shield-check"
								class="size-5"
							/>
						</div>

						<div>
							<h1 class="text-base font-bold tracking-wide text-slate-900 dark:text-white">
								Admin Panel
							</h1>
							<p class="text-xs text-slate-500 dark:text-slate-400">Scholarship System</p>
						</div>
					</div>

					<UIcon
						v-else
						name="i-lucide-shield-check"
						class="size-6 text-emerald-600"
					/>
				</div>
			</template>

			<template #default="{ collapsed }">
				<div class="flex h-full flex-col justify-between py-2">
					<UNavigationMenu
						:collapsed="collapsed"
						:items="reactiveItems[0]"
						orientation="vertical"
						class="px-2"
						:ui="{
							link: 'rounded-md text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300',
							linkLeadingIcon:
								'text-slate-400 group-data-[active=true]:text-emerald-600 dark:group-data-[active=true]:text-emerald-400',
							linkLabel: 'font-medium',
						}"
					/>

					<div
						v-if="!collapsed"
						class="mt-4 px-3"
					>
						<div class="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/70">
							<UColorModeButton class="w-full justify-start" />
						</div>
					</div>
				</div>
			</template>

			<template #footer="{ collapsed }">
				<UButton
					:avatar="{ src: 'https://github.com/benjamincanac.png' }"
					:label="collapsed ? undefined : 'Logout'"
					icon="i-lucide-log-out"
					color="neutral"
					variant="ghost"
					class="w-full justify-start text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
					:block="collapsed"
					@click="openLogoutConfirm"
				/>
			</template>
		</UDashboardSidebar>

		<UDashboardPanel class="flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
			<div class="flex-1 overflow-y-auto">
				<slot />
			</div>
		</UDashboardPanel>

		<UModal
			v-model:open="showLogoutModal"
			title="Confirm Logout"
		>
			<template #body>
				<div class="space-y-5">
					<div
						class="rounded-lg bg-rose-50 p-4 ring-1 ring-rose-100 dark:bg-rose-950/30 dark:ring-rose-900"
					>
						<div class="flex items-start gap-3">
							<div class="rounded-md bg-rose-600 p-2 text-white">
								<UIcon
									name="i-lucide-log-out"
									class="size-5"
								/>
							</div>

							<div>
								<h3 class="text-base font-semibold text-slate-900 dark:text-white">
									Log out of admin panel?
								</h3>
								<p class="text-sm text-slate-500 dark:text-slate-400">
									You will be redirected to the login page.
								</p>
							</div>
						</div>
					</div>

					<div class="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
						<UButton
							label="Cancel"
							color="neutral"
							variant="outline"
							@click="showLogoutModal = false"
						/>

						<UButton
							label="Logout"
							icon="i-lucide-log-out"
							color="error"
							@click="confirmLogout"
						/>
					</div>
				</div>
			</template>
		</UModal>
	</UDashboardGroup>
</template>
