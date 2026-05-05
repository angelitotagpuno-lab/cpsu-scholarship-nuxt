<script setup lang="ts">
import type { ScholarshipProgram } from "~/types/scholarship";

definePageMeta({
	layout: "user-header",
});

const router = useRouter();
const toast = useToast(); // ✅ ADDED

const programStore = useScholarshipStore();
const offeringStore = useScholarshipOfferingStore();

onMounted(async () => {
	await programStore.fetchAll();
	await offeringStore.getOfferings();
});

// only active programs
const activePrograms = computed(() => programStore.items.filter((p) => p.is_active));

// 🔥 FIXED MATCHING LOGIC (UNCHANGED)
function goToApplication(program: ScholarshipProgram) {
	const offering = offeringStore.offerings.find(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(o: any) => String(o.programId || o.program_id) === String(program.id) && o.status === "open",
	);

	if (!offering) {
		// ✅ UPDATED NOTIFICATION UI
		toast.add({
			title: "No Open Offering",
			description: `${program.name} is currently not available for application.`,
			color: "warning",
			icon: "i-lucide-alert-circle",
		});
		return;
	}

	router.push({
		path: "/user/portal/tdp",
		query: {
			offeringId: offering.id,
		},
	});
}

/* =========================
   UI HELPERS (UNCHANGED)
========================= */
function getColorClass(index: number) {
	return index % 2 === 0 ? "emerald" : "blue";
}

function cardClasses(color: string) {
	if (color === "emerald") {
		return {
			card: "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20",
			icon: "bg-emerald-600 text-white",
			badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
			button: "bg-emerald-600 hover:bg-emerald-700",
		};
	}

	return {
		card: "border-blue-200 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20",
		icon: "bg-blue-600 text-white",
		badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
		button: "bg-blue-600 hover:bg-blue-700",
	};
}
</script>

<template>
	<div class="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-6xl space-y-6">
			<!-- HEADER -->
			<div
				class="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
			>
				<div class="flex items-start gap-3">
					<div class="rounded-md bg-slate-900 p-2 text-white dark:bg-white dark:text-slate-900">
						<UIcon
							name="i-lucide-landmark"
							class="size-6"
						/>
					</div>

					<div>
						<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Scholarship Programs</h1>
						<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
							Select a scholarship program and proceed to application.
						</p>
					</div>
				</div>
			</div>

			<!-- CARDS -->
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				<div
					v-for="(p, index) in activePrograms"
					:key="p.id"
					:class="[
						'cursor-pointer rounded-xl p-5 shadow-sm ring-1 transition hover:shadow-md',
						cardClasses(getColorClass(index)).card,
					]"
					@click="goToApplication(p)"
				>
					<!-- ICON + TITLE -->
					<div class="flex items-start gap-3">
						<div :class="['rounded-md p-3', cardClasses(getColorClass(index)).icon]">
							<UIcon
								name="i-lucide-graduation-cap"
								class="size-6"
							/>
						</div>

						<div class="flex-1">
							<h3 class="text-lg font-bold text-slate-900 dark:text-white">
								{{ p.name }}
							</h3>

							<p class="text-sm text-slate-500 dark:text-slate-400">
								{{ p.description }}
							</p>
						</div>

						<span
							:class="[
								'rounded-full px-3 py-1 text-xs font-medium',
								cardClasses(getColorClass(index)).badge,
							]"
						>
							Open
						</span>
					</div>

					<!-- FOOTER -->
					<div class="mt-4 flex justify-end">
						<div
							:class="[
								'px-3 py-1 text-xs font-semibold rounded-md text-white',
								cardClasses(getColorClass(index)).button,
							]"
						>
							Click to Apply
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
