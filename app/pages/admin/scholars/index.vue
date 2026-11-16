<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import ScholarsTable from "./components/scholars-table.vue";
import PageHeader from "./components/page-header.vue";

import { applicationService } from "~/services/application.service";
import { scholarshipOfferingService } from "~/services/scholarship-offering.service";
import { scholarshipService } from "~/services/scholarship.service";

import type { Application } from "~/types/application";
import type { Scholar } from "~/types/scholar";
import type { ScholarshipOffering } from "~/types/scholarship-offering";
import type { ScholarshipProgram } from "~/types/scholarship";

definePageMeta({
	layout: "admin",
});

const toast = useToast();

const search = ref("");
const applications = ref<Application[]>([]);
const offerings = ref<ScholarshipOffering[]>([]);
const programs = ref<ScholarshipProgram[]>([]);

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

const STORAGE_KEY = "cpsu_scholar_edits_v1";
const REMOVED_KEY = "cpsu_removed_scholars_v1";

// Temporary changes stored in the browser
const scholarEdits = ref<Record<string, Partial<Scholar>>>({});
const removedScholarIds = ref<string[]>([]);

// Convert scholarship program names into TES or TDP
function detectProgramType(name: unknown): Scholar["scholarshipType"] {
	if (typeof name !== "string") return "Unknown";

	const normalized = name.trim().toUpperCase();

	if (/\bTES\b/.test(normalized) || normalized.includes("TERTIARY EDUCATION SUBSIDY")) {
		return "TES";
	}

	if (/\bTDP\b/.test(normalized) || normalized.includes("TULONG DUNONG")) {
		return "TDP";
	}

	return "Unknown";
}

// Match application → offering → program
function getScholarshipType(app: Application): Scholar["scholarshipType"] {
	// First try the program already included in the application
	const directName = app.offering?.scholarshipProgram?.name;

	const directType = detectProgramType(directName);

	if (directType !== "Unknown") {
		return directType;
	}

	// Find the offering using the application's offering ID
	const offeringId = app.offeringId ?? app.offering?.id;

	const offering = offerings.value.find((item) => item.id === offeringId);

	// Get program ID from application or offering
	const programId = app.offering?.scholarshipProgramId ?? offering?.scholarshipProgramId;

	if (!programId) return "Unknown";

	// Find the scholarship program
	const program = programs.value.find((item) => item.id === programId);

	return detectProgramType(program?.name);
}

// Convert approved application to scholar
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
		semester: "Not Set",
		enrolled: "Not Set",
	};
}

// Load saved local changes
function loadLocalChanges() {
	if (!import.meta.client) return;

	try {
		const savedEdits = localStorage.getItem(STORAGE_KEY);
		const savedRemoved = localStorage.getItem(REMOVED_KEY);

		if (savedEdits) {
			const parsed: unknown = JSON.parse(savedEdits);

			if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
				scholarEdits.value = parsed as Record<string, Partial<Scholar>>;
			}
		}

		if (savedRemoved) {
			const parsed: unknown = JSON.parse(savedRemoved);

			if (Array.isArray(parsed)) {
				removedScholarIds.value = parsed.filter((id): id is string => typeof id === "string");
			}
		}
	} catch (error) {
		console.error("Unable to load saved scholar changes:", error);
	}
}

// Save local changes
function saveLocalChanges() {
	if (!import.meta.client) return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(scholarEdits.value));

		localStorage.setItem(REMOVED_KEY, JSON.stringify(removedScholarIds.value));
	} catch (error) {
		console.error("Unable to save scholar changes:", error);

		toast.add({
			title: "Unable to Save Changes",
			description: "Your changes couldn't be saved. Please try again.",
			color: "error",
			icon: "i-lucide-circle-alert",
		});
	}
}

// Fetch every page of a paginated API
async function fetchAllPages<T>(
	fetchPage: (page: number) => Promise<{
		data: T[];
		meta: { hasNext: boolean };
	}>,
): Promise<T[]> {
	const results: T[] = [];
	let page = 1;
	let hasNext = true;

	while (hasNext) {
		const response = await fetchPage(page);

		if (!Array.isArray(response.data)) {
			throw new Error("Invalid API response.");
		}

		results.push(...response.data);

		hasNext = response.meta?.hasNext ?? false;

		if (hasNext && response.data.length === 0) {
			throw new Error("Invalid pagination response.");
		}

		page++;
	}

	return results;
}

// Fetch applications and program information
async function fetchScholars() {
	if (isLoading.value) return;

	isLoading.value = true;
	errorMessage.value = null;

	try {
		// Applications are required to display scholars
		applications.value = await fetchAllPages((page) =>
			applicationService.index({
				page,
				perPage: 100,
				sort: "createdAt",
				order: "desc",
			}),
		);

		// Offerings and programs are used for TES/TDP detection.
		// Load independently so a failure doesn't hide applicants.
		const [offeringResult, programResult] = await Promise.allSettled([
			fetchAllPages((page) =>
				scholarshipOfferingService.index({
					page,
					perPage: 100,
					sort: "createdAt",
					order: "desc",
				}),
			),
			fetchAllPages((page) =>
				scholarshipService.index({
					page,
					perPage: 100,
					sort: "createdAt",
					order: "desc",
				}),
			),
		]);

		if (offeringResult.status === "fulfilled") {
			offerings.value = offeringResult.value;
		} else {
			console.error("Unable to load scholarship offerings:", offeringResult.reason);
		}

		if (programResult.status === "fulfilled") {
			programs.value = programResult.value;
		} else {
			console.error("Unable to load scholarship programs:", programResult.reason);
		}

		if (offeringResult.status === "rejected" || programResult.status === "rejected") {
			toast.add({
				title: "Some Program Details Are Unavailable",
				description: "Your scholars are displayed, but some scholarship types may not appear yet.",
				color: "warning",
				icon: "i-lucide-info",
			});
		}
	} catch (error: unknown) {
		console.error("Failed to load scholars:", error);

		errorMessage.value = "We couldn't load the scholars list. Please try again.";

		toast.add({
			title: "Unable to Load Scholars",
			description: errorMessage.value,
			color: "error",
			icon: "i-lucide-circle-alert",
		});
	} finally {
		isLoading.value = false;
	}
}

// Only accepted and approved applications
const approvedScholars = computed<Scholar[]>(() =>
	applications.value
		.filter((app) => ["accepted", "approved"].includes(app.status?.toLowerCase() ?? ""))
		.map(toScholar),
);

// Merge backend data with temporary local changes
const displayedScholars = computed<Scholar[]>(() =>
	approvedScholars.value
		.filter((scholar) => !removedScholarIds.value.includes(String(scholar.id)))
		.map((scholar) => ({
			...scholar,
			...scholarEdits.value[String(scholar.id)],
			// Always use the latest backend program information
			id: scholar.id,
			scholarshipType: scholar.scholarshipType,
		})),
);

// Search
const filteredScholars = computed(() => {
	const query = search.value.trim().toLowerCase();

	if (!query) return displayedScholars.value;

	return displayedScholars.value.filter((scholar) =>
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

// Number rows
const numberedScholars = computed(() =>
	filteredScholars.value.map((scholar, index) => ({
		...scholar,
		no: index + 1,
	})),
);

// Statistics
const totalScholars = computed(() => displayedScholars.value.length);

const totalEnrolled = computed(
	() => displayedScholars.value.filter((scholar) => scholar.enrolled === "Enrolled").length,
);

const totalNotActive = computed(
	() =>
		displayedScholars.value.filter((scholar) =>
			["Not Enrolled", "Drop", "Stop"].includes(scholar.enrolled),
		).length,
);

// Update scholar locally
function updateScholar(updatedScholar: Scholar) {
	const id = String(updatedScholar.id);

	if (!id || id === "undefined") return;

	scholarEdits.value = {
		...scholarEdits.value,
		[id]: {
			lastName: updatedScholar.lastName,
			firstName: updatedScholar.firstName,
			middleInitial: updatedScholar.middleInitial,
			course: updatedScholar.course,
			yearLevel: updatedScholar.yearLevel,
			semester: updatedScholar.semester,
			enrolled: updatedScholar.enrolled,
		},
	};

	saveLocalChanges();

	toast.add({
		title: "Scholar Updated Successfully",
		description: `${updatedScholar.firstName} ${updatedScholar.lastName}'s information has been updated.`,
		color: "success",
		icon: "i-lucide-check-circle",
	});
}

// Remove scholar from local list
function removeScholar(scholar: Scholar) {
	const id = String(scholar.id);

	if (!id || id === "undefined") return;

	if (!removedScholarIds.value.includes(id)) {
		removedScholarIds.value = [...removedScholarIds.value, id];
	}

	saveLocalChanges();

	toast.add({
		title: "Scholar Hidden From List",
		description: `${scholar.firstName} ${scholar.lastName} has been hidden from this browser's scholars list.`,
		color: "success",
		icon: "i-lucide-check-circle",
	});
}

onMounted(async () => {
	loadLocalChanges();
	await fetchScholars();
});
</script>

<template>
	<div class="h-full space-y-6 overflow-y-auto bg-slate-50 p-6 dark:bg-slate-950">
		<!-- PAGE HEADER -->
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

		<!-- STATISTICS -->
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

		<!-- ERROR -->
		<UAlert
			v-if="errorMessage"
			color="error"
			variant="soft"
			icon="i-lucide-circle-alert"
			title="Unable to Load Scholars"
			:description="errorMessage"
		/>

		<!-- SCHOLAR LIST -->
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

			<!-- LOADING -->
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

			<!-- EMPTY STATE -->
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

			<!-- TABLE -->
			<div
				v-else
				class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800"
			>
				<ScholarsTable
					:scholars="numberedScholars"
					:on-remove="removeScholar"
					:on-update="updateScholar"
				/>
			</div>
		</UCard>
	</div>
</template>
