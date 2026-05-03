<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useScholarshipStore } from "~/stores/scholarship.store";
import type { ScholarshipOffering } from "~/types/scholarship";

definePageMeta({
	layout: "user-header",
});

const store = useScholarshipStore();

const loading = ref(false);

// 👉 use store instead of direct service (IMPORTANT)
const offerings = computed<ScholarshipOffering[]>(() => store.offerings);

onMounted(async () => {
	loading.value = true;

	try {
		await store.fetchOfferings({
			status: "open",
		});
	} catch (err) {
		console.error("Failed to load offerings:", err);
	} finally {
		loading.value = false;
	}
});
</script>

<template>
	<div class="p-6 space-y-6">
		<!-- HEADER -->
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Available Scholarships</h1>
			<p class="text-sm text-slate-500">Select a scholarship you want to apply for</p>
		</div>

		<!-- LOADING -->
		<div
			v-if="loading"
			class="text-gray-500"
		>
			Loading scholarships...
		</div>

		<!-- EMPTY -->
		<div
			v-else-if="!offerings.length"
			class="text-gray-500"
		>
			No scholarships available right now.
		</div>

		<!-- LIST -->
		<div
			v-else
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
		>
			<div
				v-for="o in offerings"
				:key="o.id"
				class="p-4 border rounded-lg bg-white dark:bg-slate-900 shadow-sm"
			>
				<!-- PROGRAM NAME -->
				<h2 class="font-semibold text-lg">
					{{ o.program?.name }}
				</h2>

				<!-- DESCRIPTION -->
				<p class="text-sm text-gray-500 mt-1">
					{{ o.program?.description }}
				</p>

				<!-- DETAILS -->
				<div class="mt-3 text-sm space-y-1">
					<p>📅 {{ o.academicYear }} • Semester {{ o.semester }}</p>

					<p>💰 Budget: ₱{{ o.allocatedBudget.toLocaleString() }}</p>

					<p>
						🎯 Slots:
						{{ o.availableSlots ?? "Unlimited" }}
					</p>

					<p>
						📌 Status:
						<span class="font-medium capitalize">
							{{ o.status }}
						</span>
					</p>
				</div>

				<!-- CTA -->
				<NuxtLink
					:to="`/scholarships/${o.id}`"
					class="inline-block mt-4 text-blue-600 font-medium hover:underline"
				>
					View Details →
				</NuxtLink>
			</div>
		</div>
	</div>
</template>
