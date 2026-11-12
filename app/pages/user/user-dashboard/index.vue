<script setup lang="ts">
import { ref, computed } from "vue";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
	layout: "user-header",
});

const scholars = ref([
	{ lastName: "Dela Cruz", firstName: "Juan", middleInitial: "A" },
	{ lastName: "Santos", firstName: "Maria", middleInitial: "B" },
	{ lastName: "Reyes", firstName: "Pedro", middleInitial: "C" },
	{ lastName: "Lopez", firstName: "Ana", middleInitial: "D" },
	{ lastName: "Rivera", firstName: "Mark", middleInitial: "E" },
	{ lastName: "Ramos", firstName: "Liza", middleInitial: "F" },
]);

const numberedScholars = computed(() =>
	scholars.value.map((s, index) => ({
		no: index + 1,
		...s,
	})),
);

const columns: TableColumn<(typeof numberedScholars.value)[0]>[] = [
	{ accessorKey: "no", header: "No." },
	{ accessorKey: "lastName", header: "Last Name" },
	{ accessorKey: "firstName", header: "First Name" },
	{ accessorKey: "middleInitial", header: "M.I." },
];
</script>

<template>
	<div class="min-h-screen p-6 bg-slate-50 dark:bg-slate-900 flex justify-center">
		<div class="w-full max-w-4xl space-y-6">
			<!-- HEADER -->
			<div
				class="rounded-lg bg-emerald-50 p-4 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:ring-emerald-900"
			>
				<div class="flex items-start gap-3">
					<div class="rounded-md bg-emerald-600 p-2 text-white">
						<UIcon
							name="i-lucide-award"
							class="size-5"
						/>
					</div>

					<div>
						<h2 class="text-base font-semibold text-slate-900 dark:text-white">
							Approved Scholars
						</h2>
						<p class="text-sm text-slate-500 dark:text-slate-400">
							List of students currently approved for scholarship program
						</p>
					</div>
				</div>
			</div>

			<!-- TABLE CARD -->
			<UCard
				class="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
			>
				<UTable
					:data="numberedScholars"
					:columns="columns"
					class="w-full"
				/>
			</UCard>
		</div>
	</div>
</template>
