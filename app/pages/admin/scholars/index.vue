<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ScholarsTable from "./components/scholars-table.vue";
import PageHeader from "./components/page-header.vue";
import { applicationService } from "~/services/application.service";
import type { Application } from "~/types/application";
import type { Scholar } from "~/types/scholar";

definePageMeta({
	layout: "admin",
});

const toast = useToast();

const search = ref("");
const applications = ref<Application[]>([]);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

// Replace these with real program UUIDs from your API.
const programTypeById: Record<string, "TES" | "TDP"> = {};

function getScholarshipType(app: Application): Scholar["scholarshipType"] {
	const programId = app.offering?.scholarshipProgramId;

	if (!programId) return "Unknown";

	return programTypeById[programId] ?? "Unknown";
}

function toScholar(app: Application): Scholar {
	return {
		id: app.id,
		no: 0,
		scholarshipType: getScholarshipType(app),
		lastName: app.lastName || "",
		firstName: app.firstName || "",
		middleInitial: app.middleName?.charAt(0) ?? "",
		course: app.course?.abbreviation || app.course?.name || "N/A",
		yearLevel: String(app.yearLevel ?? "N/A"),
		semester: "N/A",
		enrolled: "Not Set",
	};
}

async function fetchScholars() {
	if (isLoading.value) return;

	isLoading.value = true;
	errorMessage.value = null;

	try {
		const results: Application[] = [];
		let page = 1;
		let hasNext = true;

		while (hasNext) {
			const response = await applicationService.index({
				page,
				perPage: 100,
				sort: "createdAt",
				order: "desc",
			});

			if (!Array.isArray(response.data)) {
				throw new Error("Invalid applications API response.");
			}

			results.push(...response.data);
			hasNext = response.meta?.hasNext ?? false;

			if (hasNext && response.data.length === 0) {
				throw new Error("Invalid pagination response.");
			}

			page++;
		}

		applications.value = results;
	} catch (error: unknown) {
		console.error("Failed to load scholars:", error);

		const e = error as {
			data?: { message?: string };
			message?: string;
		};

		errorMessage.value = e.data?.message || e.message || "Unable to load scholars.";

		toast.add({
			title: "Failed to load scholars",
			description: errorMessage.value,
			color: "error",
		});
	} finally {
		isLoading.value = false;
	}
}

const approvedScholars = computed<Scholar[]>(() =>
	applications.value
		.filter((app) => ["accepted", "approved"].includes(app.status?.toLowerCase() ?? ""))
		.map(toScholar),
);

const filteredScholars = computed(() => {
	const query = search.value.trim().toLowerCase();

	if (!query) return approvedScholars.value;

	return approvedScholars.value.filter((scholar) =>
		[
			scholar.scholarshipType,
			scholar.lastName,
			scholar.firstName,
			scholar.middleInitial,
			scholar.course,
			scholar.yearLevel,
			scholar.semester,
			scholar.enrolled,
		]
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

const totalScholars = computed(() => approvedScholars.value.length);

const totalEnrolled = computed(
	() => approvedScholars.value.filter((s) => s.enrolled === "Enrolled").length,
);

const totalNotActive = computed(
	() =>
		approvedScholars.value.filter((s) => ["Not Enrolled", "Drop", "Stop"].includes(s.enrolled))
			.length,
);

function updateScholar(_scholar: Scholar) {
	toast.add({
		title: "Update unavailable",
		description: "The API does not yet provide a scholar update endpoint.",
		color: "warning",
	});
}

function removeScholar(_scholar: Scholar) {
	toast.add({
		title: "Removal unavailable",
		description: "The API does not yet provide a scholar removal endpoint.",
		color: "warning",
	});
}

onMounted(fetchScholars);
</script>

<template>
	<div class="h-full space-y-6 overflow-y-auto bg-slate-50 p-6 dark:bg-slate-950">
		<div
			class="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
		>
			<div class="flex items-center justify-between gap-3">
				<div class="flex items-center gap-3">
					<UDashboardSidebarCollapse />
					<PageHeader
						title="Scholars"
						description="View accepted and approved TDP and TES scholarship applicants."
					/>
				</div>

				<UButton
					icon="i-lucide-refresh-cw"
					color="neutral"
					variant="outline"
					:loading="isLoading"
					@click="fetchScholars"
				>
					Refresh
				</UButton>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<UCard class="border-l-4 border-l-blue-500 bg-blue-50/80 dark:bg-blue-950/30">
				<p class="text-sm font-medium text-blue-700 dark:text-blue-300">Total Scholars</p>
				<p class="mt-1 text-3xl font-bold text-blue-950 dark:text-blue-100">
					{{ totalScholars }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30">
				<p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Enrolled</p>
				<p class="mt-1 text-3xl font-bold text-emerald-950 dark:text-emerald-100">
					{{ totalEnrolled }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-rose-500 bg-rose-50/80 dark:bg-rose-950/30">
				<p class="text-sm font-medium text-rose-700 dark:text-rose-300">Not Active</p>
				<p class="mt-1 text-3xl font-bold text-rose-950 dark:text-rose-100">
					{{ totalNotActive }}
				</p>
			</UCard>
		</div>

		<UAlert
			v-if="errorMessage"
			color="error"
			variant="soft"
			icon="i-lucide-circle-alert"
			title="Unable to load scholars"
			:description="errorMessage"
		/>

		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 class="font-semibold text-slate-900 dark:text-white">Scholar List</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Accepted and approved scholarship applicants.
					</p>
				</div>

				<div class="flex flex-col gap-2 sm:w-80">
					<UInput
						v-model="search"
						icon="i-lucide-search"
						placeholder="Search scholar, program, course..."
						color="neutral"
						variant="outline"
					/>
					<span class="text-right text-xs font-medium text-slate-500 dark:text-slate-400">
						{{ filteredScholars.length }} records
					</span>
				</div>
			</div>

			<div
				v-if="isLoading"
				class="flex flex-col items-center justify-center gap-3 py-12"
			>
				<UIcon
					name="i-lucide-loader-circle"
					class="size-8 animate-spin text-primary"
				/>
				<p class="text-sm text-slate-500">Loading scholars...</p>
			</div>

			<div
				v-else-if="numberedScholars.length === 0"
				class="flex flex-col items-center justify-center gap-3 py-12"
			>
				<UIcon
					name="i-lucide-graduation-cap"
					class="size-10 text-slate-400"
				/>
				<p class="font-medium text-slate-700 dark:text-slate-200">No scholars found</p>
				<p class="text-center text-sm text-slate-500">
					{{
						search
							? "No scholars match your search."
							: "Accepted and approved applicants will appear here."
					}}
				</p>
			</div>

			<div
				v-else
				class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800"
			>
				<ScholarsTable
					:scholars="numberedScholars"
					:onRemove="removeScholar"
					:onUpdate="updateScholar"
				/>
			</div>
		</UCard>
	</div>
</template>
