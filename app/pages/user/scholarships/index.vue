<script setup lang="ts">
import type { ScholarshipProgram } from "~/types/scholarship";

definePageMeta({
	layout: "user-header",
});

const router = useRouter();

const programStore = useScholarshipStore();
const offeringStore = useScholarshipOfferingStore();

onMounted(async () => {
	await programStore.fetchAll();
	await offeringStore.getOfferings();
});

// only active programs
const activePrograms = computed(() => programStore.items.filter((p) => p.is_active));

// 🔥 FIXED MATCHING LOGIC
function goToApplication(program: ScholarshipProgram) {
	const offering = offeringStore.offerings.find(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(o: any) => String(o.programId || o.program_id) === String(program.id) && o.status === "open",
	);

	if (!offering) {
		alert("No open offering yet for this program.");
		return;
	}

	router.push({
		path: "/user/portal/tdp",
		query: {
			offeringId: offering.id,
		},
	});
}
</script>

<template>
	<div class="min-h-screen bg-slate-50 p-6 dark:bg-slate-950 space-y-8">
		<!-- HEADER -->
		<div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900">
			<h1 class="text-2xl font-bold">Scholarship Programs</h1>
		</div>

		<!-- ACTIVE PROGRAMS -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			<div
				v-for="p in activePrograms"
				:key="p.id"
				class="cursor-pointer rounded-xl bg-white p-5 shadow-sm ring-1 ring-emerald-200 hover:shadow-md"
				@click="goToApplication(p)"
			>
				<h3 class="font-semibold">{{ p.name }}</h3>

				<p class="text-sm text-slate-500 mt-1">
					{{ p.description }}
				</p>

				<p class="mt-3 text-xs text-emerald-600 font-medium">Click to Apply</p>
			</div>
		</div>
	</div>
</template>
