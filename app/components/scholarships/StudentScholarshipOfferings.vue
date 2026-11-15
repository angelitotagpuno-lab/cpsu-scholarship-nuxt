<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useScholarshipOfferingStore } from "~/stores/scholarship-offering.store";
import { useAuthStore } from "~/stores/auth.store";
import type { ScholarshipOffering } from "~/types/scholarship-offering";

const router = useRouter();
const toast = useToast();

const authStore = useAuthStore();
const offeringStore = useScholarshipOfferingStore();

const isLoading = ref(false);
const isCheckingApplications = ref(true);
const loadError = ref<string | null>(null);
const appliedOfferings = ref<string[]>([]);

// SCHOLARSHIP PROGRAM IDS
const PROGRAM_ROUTES: Record<string, "tes" | "tdp"> = {
	"72bbaec2-ead3-47be-b547-7a2f82ccf183": "tdp",
	"43bb7b99-8e50-4a5a-8e98-f6f1fef11385": "tes",
};

// AUTHENTICATED STUDENT UUID
const studentId = computed(() => authStore.currentAuth?.student?.id || "");

// LOCAL STORAGE KEY
function getApplicationKey(offeringId: string): string {
	return `scholarship-applied:${studentId.value}:${offeringId}`;
}

// LOAD ALREADY SUBMITTED APPLICATIONS
function loadAppliedOfferings() {
	if (!studentId.value) {
		appliedOfferings.value = [];
		return;
	}

	appliedOfferings.value = offeringStore.offerings
		.filter((offering) => {
			const key = getApplicationKey(offering.id);

			return localStorage.getItem(key) === "true";
		})
		.map((offering) => offering.id);

	console.log("Student UUID:", studentId.value);
	console.log("Already applied offerings:", appliedOfferings.value);
}

// CHECK IF STUDENT ALREADY APPLIED
function hasApplied(offering: ScholarshipOffering): boolean {
	return appliedOfferings.value.includes(offering.id);
}

// FETCH SCHOLARSHIP OFFERINGS
async function loadScholarships() {
	isLoading.value = true;
	isCheckingApplications.value = true;
	loadError.value = null;

	try {
		// LOAD AUTHENTICATED STUDENT
		if (!authStore.currentAuth?.student?.id) {
			const authenticated = await authStore.getUser();

			if (!authenticated || !authStore.currentAuth?.student?.id) {
				throw new Error("Unable to identify the student. Please log in again.");
			}
		}

		// FETCH SCHOLARSHIP OFFERINGS
		const success = await offeringStore.getOfferings({
			page: 1,
			perPage: 100,
		});

		if (!success) {
			throw new Error(offeringStore.errorMessage || "Failed to load scholarship offerings");
		}

		// LOAD APPLICATION STATUS
		loadAppliedOfferings();
	} catch (error) {
		loadError.value =
			error instanceof Error ? error.message : "Unable to load scholarship offerings";
	} finally {
		isCheckingApplications.value = false;
		isLoading.value = false;
	}
}

onMounted(loadScholarships);

// ACTIVE AND NON-ARCHIVED OFFERINGS
const availableOfferings = computed(() =>
	offeringStore.offerings.filter(
		(offering) =>
			offering.isActive === true &&
			offering.isArchived === false &&
			!!offering.scholarshipProgramId,
	),
);

// IDENTIFY TES OR TDP
function getProgramType(offering: ScholarshipOffering): "tes" | "tdp" | null {
	if (!offering.scholarshipProgramId) {
		return null;
	}

	return PROGRAM_ROUTES[offering.scholarshipProgramId] ?? null;
}

// DISPLAY SCHOLARSHIP NAME
function getProgramName(offering: ScholarshipOffering): string {
	const type = getProgramType(offering);

	if (type === "tes") {
		return "Tertiary Education Subsidy (TES)";
	}

	if (type === "tdp") {
		return "Tulong Dunong Program (TDP)";
	}

	return "Scholarship Offering";
}

// CHECK IF STUDENT CAN APPLY
function canApply(offering: ScholarshipOffering): boolean {
	return (
		!isCheckingApplications.value &&
		!!studentId.value &&
		offering.isActive === true &&
		offering.isArchived === false &&
		!!offering.id &&
		getProgramType(offering) !== null &&
		!hasApplied(offering)
	);
}

// FORMAT AMOUNT
function formatCurrency(value: string | number) {
	const amount = Number(value);

	if (!Number.isFinite(amount)) return "—";

	return new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
		minimumFractionDigits: 2,
	}).format(amount);
}

// CARD COLORS
function getColorClass(index: number) {
	return index % 2 === 0 ? "emerald" : "blue";
}

function cardClasses(color: string) {
	if (color === "emerald") {
		return {
			card: "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20",
			icon: "bg-emerald-600 text-white",
			badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
		};
	}

	return {
		card: "border-blue-200 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20",
		icon: "bg-blue-600 text-white",
		badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
	};
}

// OPEN TES OR TDP APPLICATION
async function goToApplication(offering: ScholarshipOffering) {
	// REFRESH LOCAL APPLICATION STATUS
	loadAppliedOfferings();

	// PREVENT DUPLICATE APPLICATION
	if (hasApplied(offering)) {
		toast.add({
			title: "Already Applied",
			description: "You have already submitted an application for this scholarship offering.",
			color: "warning",
		});

		return;
	}

	// CHECK OFFERING AVAILABILITY
	if (!canApply(offering)) {
		toast.add({
			title: "Application Unavailable",
			description:
				"This scholarship offering is unavailable or your student profile could not be verified.",
			color: "warning",
		});

		return;
	}

	const type = getProgramType(offering);

	if (!type) return;

	await router.push({
		path: `/user/portal/${type}`,
		query: {
			offeringId: offering.id,
		},
	});
}
</script>

<template>
	<div class="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-6xl space-y-6">
			<!-- HEADER -->
			<div
				class="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
			>
				<div class="flex items-start justify-between gap-3">
					<div class="flex items-start gap-3">
						<div class="rounded-md bg-slate-900 p-2 text-white dark:bg-white dark:text-slate-900">
							<UIcon
								name="i-lucide-landmark"
								class="size-6"
							/>
						</div>

						<div>
							<h1 class="text-2xl font-bold text-slate-900 dark:text-white">
								Scholarship Offerings
							</h1>

							<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
								Browse available scholarship offerings.
							</p>
						</div>
					</div>

					<UButton
						icon="i-lucide-refresh-cw"
						color="neutral"
						variant="outline"
						:loading="isLoading"
						@click="loadScholarships"
					>
						Refresh
					</UButton>
				</div>
			</div>

			<!-- ERROR -->
			<UAlert
				v-if="loadError"
				color="error"
				variant="soft"
				icon="i-lucide-circle-alert"
				title="Unable to Load Scholarships"
				:description="loadError"
			/>

			<!-- LOADING -->
			<div
				v-if="isLoading"
				class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
			>
				<UCard
					v-for="n in 3"
					:key="n"
				>
					<USkeleton class="mb-4 h-10 w-10" />
					<USkeleton class="mb-3 h-6 w-3/4" />
					<USkeleton class="mb-3 h-4 w-full" />
					<USkeleton class="h-10 w-full" />
				</UCard>
			</div>

			<!-- EMPTY -->
			<div
				v-else-if="!loadError && availableOfferings.length === 0"
				class="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900"
			>
				<UIcon
					name="i-lucide-calendar-x"
					class="mx-auto mb-3 size-12 text-slate-400"
				/>

				<h2 class="text-lg font-semibold">No Available Scholarship Offerings</h2>

				<p class="mt-2 text-sm text-slate-500">
					There are currently no active scholarship offerings available for application.
				</p>
			</div>

			<!-- OFFERING CARDS -->
			<div
				v-else-if="!loadError"
				class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
			>
				<UCard
					v-for="(offering, index) in availableOfferings"
					:key="offering.id"
					:class="[
						'border shadow-sm transition hover:shadow-md',
						cardClasses(getColorClass(index)).card,
					]"
				>
					<div class="flex h-full flex-col space-y-5">
						<!-- TITLE -->
						<div class="flex items-start gap-3">
							<div :class="['rounded-md p-3', cardClasses(getColorClass(index)).icon]">
								<UIcon
									name="i-lucide-graduation-cap"
									class="size-6"
								/>
							</div>

							<div class="min-w-0 flex-1">
								<h2 class="text-lg font-bold text-slate-900 dark:text-white">
									{{ getProgramName(offering) }}
								</h2>

								<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
									School Year {{ offering.schoolYear }}
								</p>
							</div>
						</div>

						<!-- STATUS -->
						<div class="flex flex-wrap items-center justify-between gap-2">
							<span
								:class="[
									'rounded-full px-3 py-1 text-xs font-medium',
									hasApplied(offering)
										? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
										: cardClasses(getColorClass(index)).badge,
								]"
							>
								{{ hasApplied(offering) ? "Already Applied" : "Active Offering" }}
							</span>

							<span class="text-xs font-medium text-slate-500"> SY {{ offering.schoolYear }} </span>
						</div>

						<!-- BENEFITS -->
						<div
							class="rounded-md bg-white/80 p-4 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-slate-800"
						>
							<p class="text-xs text-slate-500">Amount Per Semester</p>

							<p class="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
								{{ formatCurrency(offering.amountPerSemester) }}
							</p>

							<div
								v-if="Number(offering.pwdAdditional) > 0"
								class="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700"
							>
								<p class="text-xs text-slate-500">PWD Additional Assistance</p>

								<p class="font-semibold text-slate-900 dark:text-white">
									{{ formatCurrency(offering.pwdAdditional) }}
								</p>
							</div>
						</div>

						<!-- DETAILS -->
						<div class="space-y-2 text-sm text-slate-600 dark:text-slate-300">
							<div class="flex items-center gap-2">
								<UIcon
									name="i-lucide-calendar"
									class="size-4"
								/>

								<span> School Year: {{ offering.schoolYear }} </span>
							</div>

							<div class="flex items-center gap-2">
								<UIcon
									:name="hasApplied(offering) ? 'i-lucide-check-circle' : 'i-lucide-check-circle-2'"
									class="size-4 text-emerald-600"
								/>

								<span>
									{{ hasApplied(offering) ? "Application submitted" : "Active offering" }}
								</span>
							</div>
						</div>

						<!-- APPLY BUTTON -->
						<div class="mt-auto pt-4">
							<UButton
								block
								size="lg"
								:icon="hasApplied(offering) ? 'i-lucide-check-circle' : 'i-lucide-arrow-right'"
								:color="
									hasApplied(offering) ? 'neutral' : canApply(offering) ? 'success' : 'neutral'
								"
								:disabled="!canApply(offering)"
								@click="goToApplication(offering)"
							>
								{{
									hasApplied(offering)
										? "Already Applied"
										: canApply(offering)
											? `Apply for ${getProgramType(offering)?.toUpperCase()}`
											: "Application Form Unavailable"
								}}
							</UButton>
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>
