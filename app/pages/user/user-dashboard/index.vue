<script setup lang="ts">
import { ref, computed } from "vue";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
	layout: "user-header",
});

type ApprovedScholar = {
	no: number;
	lastName: string;
	firstName: string;
	middleInitial: string;
};

const search = ref("");
const scholars = ref<ApprovedScholar[]>([]);

const filteredScholars = computed(() => {
	const query = search.value.trim().toLowerCase();

	if (!query) return scholars.value;

	return scholars.value.filter((scholar) =>
		[scholar.lastName, scholar.firstName, scholar.middleInitial]
			.join(" ")
			.toLowerCase()
			.includes(query),
	);
});

const numberedScholars = computed(() =>
	filteredScholars.value.map((scholar, index) => ({
		...scholar,
		no: index + 1,
	})),
);

const columns: TableColumn<ApprovedScholar>[] = [
	{ accessorKey: "no", header: "No." },
	{ accessorKey: "lastName", header: "Last Name" },
	{ accessorKey: "firstName", header: "First Name" },
	{ accessorKey: "middleInitial", header: "M.I." },
];
</script>

<template>
	<div class="flex min-h-screen justify-center bg-slate-50 p-6 dark:bg-slate-900">
		<div class="w-full max-w-4xl space-y-6">
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
							Students approved for scholarship programs.
						</p>
					</div>
				</div>
			</div>

			<UCard
				class="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
			>
				<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 class="font-semibold text-slate-900 dark:text-white">Approved Scholars List</h3>

						<p class="text-sm text-slate-500 dark:text-slate-400">
							{{ scholars.length }} approved scholars
						</p>
					</div>

					<UInput
						v-model="search"
						icon="i-lucide-search"
						placeholder="Search scholar..."
						class="w-full sm:w-64"
					/>
				</div>

				<UTable
					:data="numberedScholars"
					:columns="columns"
					class="w-full"
				/>

				<div
					v-if="numberedScholars.length === 0"
					class="flex flex-col items-center justify-center gap-3 py-8"
				>
					<UIcon
						name="i-lucide-clock"
						class="size-10 text-slate-400"
					/>

					<p class="font-medium text-slate-700 dark:text-slate-200">
						Approved scholar list unavailable
					</p>

					<p class="max-w-md text-center text-sm text-slate-500">
						The public approved-scholar list is not yet available through the student API.
					</p>
				</div>
			</UCard>
		</div>
	</div>
</template>
