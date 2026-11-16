<script setup lang="ts">
import { computed, ref } from "vue";
import type { Application } from "~/types/application";
import type { ScholarshipProgram } from "~/types/scholarship";

const props = defineProps<{
	applications: Application[];
	scholarshipPrograms: ScholarshipProgram[];
}>();

const program = ref<"TES" | "TDP">("TES");

function getProgramType(app: Application): "TES" | "TDP" | "UNKNOWN" {
	const embeddedName = app.offering?.scholarshipProgram?.name;

	const programId = app.offering?.scholarshipProgramId;

	const matchedProgram = props.scholarshipPrograms.find((item) => item.id === programId);

	const name = (embeddedName || matchedProgram?.name || "").trim().toLowerCase();

	if (name === "tes" || name.includes("tertiary education subsidy")) {
		return "TES";
	}

	if (name === "tdp" || name.includes("tulong dunong")) {
		return "TDP";
	}

	return "UNKNOWN";
}

const tesApplications = computed(() =>
	props.applications.filter((app) => getProgramType(app) === "TES"),
);

const tdpApplications = computed(() =>
	props.applications.filter((app) => getProgramType(app) === "TDP"),
);

const unknownCount = computed(
	() => props.applications.filter((app) => getProgramType(app) === "UNKNOWN").length,
);

const selectedApplications = computed(() =>
	program.value === "TES" ? tesApplications.value : tdpApplications.value,
);

// Convert numeric strings safely.
function numericValue(value: unknown): number | null {
	if (typeof value !== "string" && typeof value !== "number") {
		return null;
	}

	const raw = String(value).trim();

	if (!raw) return null;

	const cleaned = raw.replace(/[₱,\s]/g, "");

	if (!/^\d+(\.\d+)?$/.test(cleaned)) {
		return null;
	}

	const result = Number(cleaned);

	return Number.isFinite(result) ? result : null;
}

// TES: lower GWA means better academic performance.
function getGwa(app: Application): number | null {
	const gwa = numericValue(app.gwa);

	if (gwa === null || gwa < 1 || gwa > 5) {
		return null;
	}

	return gwa;
}

// TDP: calculate reported total monthly parent income.
function getIncome(app: Application): number | null {
	const parents = app.parents ?? [];

	if (parents.length === 0) return null;

	const incomes = parents.map((parent) => numericValue(parent.monthlyIncome));

	if (incomes.some((income) => income === null)) {
		return null;
	}

	return incomes.reduce<number>((sum, income) => sum + (income ?? 0), 0);
}

// Only rank pending/under-review applicants from
// the selected scholarship program.
const ranked = computed(() => {
	const pending = selectedApplications.value.filter(
		(app) => app.status === "pending" || app.status === "under_review",
	);

	const mapped = pending.map((app) => {
		const value = program.value === "TES" ? getGwa(app) : getIncome(app);

		return {
			application: app,
			value,
			hasData: value !== null,
		};
	});

	return mapped.sort((a, b) => {
		if (!a.hasData && !b.hasData) return 0;
		if (!a.hasData) return 1;
		if (!b.hasData) return -1;

		return (a.value ?? 0) - (b.value ?? 0);
	});
});

function fullName(app: Application): string {
	return [app.firstName, app.middleName, app.lastName, app.extName].filter(Boolean).join(" ");
}

function formatValue(value: number | null): string {
	if (value === null) return "Missing data";

	if (program.value === "TES") {
		return value.toFixed(2);
	}

	return new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
	}).format(value);
}
</script>

<template>
	<UCard>
		<div class="space-y-5">
			<div>
				<h2 class="text-lg font-bold">Applicant Review Recommendations</h2>

				<p class="text-sm text-slate-500">
					Preliminary sorting using submitted application data. Final decisions remain with the
					administrator.
				</p>
			</div>

			<!-- PROGRAM SELECTION -->
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<UButton
					color="primary"
					:variant="program === 'TES' ? 'solid' : 'outline'"
					size="lg"
					block
					class="justify-between"
					@click="program = 'TES'"
				>
					<span>TES - Academic Performance</span>

					<UBadge
						color="neutral"
						variant="soft"
					>
						{{ tesApplications.length }}
					</UBadge>
				</UButton>

				<UButton
					color="primary"
					:variant="program === 'TDP' ? 'solid' : 'outline'"
					size="lg"
					block
					class="justify-between"
					@click="program = 'TDP'"
				>
					<span>TDP - Family Income</span>

					<UBadge
						color="neutral"
						variant="soft"
					>
						{{ tdpApplications.length }}
					</UBadge>
				</UButton>
			</div>

			<UAlert
				title="Preliminary review only"
				description="Recommendations are based on available application data. Verify supporting documents and eligibility requirements before making a final decision."
				color="info"
				variant="soft"
			/>

			<UAlert
				v-if="unknownCount > 0"
				title="Unidentified scholarship programs"
				:description="`${unknownCount} application(s) on the loaded page could not be identified as TES or TDP and are excluded from these tables.`"
				color="warning"
				variant="soft"
			/>

			<!-- SELECTED PROGRAM HEADER -->
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h3 class="font-semibold">
						{{
							program === "TES" ? "TES Applicant Recommendations" : "TDP Applicant Recommendations"
						}}
					</h3>

					<p class="text-xs text-slate-500">
						{{
							program === "TES"
								? "Sorted by GWA, lowest first"
								: "Sorted by reported monthly family income, lowest first"
						}}
					</p>
				</div>

				<UBadge
					color="primary"
					variant="soft"
				>
					{{ ranked.length }} for review
				</UBadge>
			</div>

			<!-- RECOMMENDATION TABLE -->
			<div class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
				<table class="w-full text-left text-sm">
					<thead class="border-b bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
						<tr>
							<th class="p-3">Ranking</th>
							<th class="p-3">Applicant</th>
							<th class="p-3">School Year</th>
							<th class="p-3">
								{{ program === "TES" ? "GWA" : "Monthly Income" }}
							</th>
							<th class="p-3">Assessment</th>
						</tr>
					</thead>

					<tbody>
						<tr
							v-for="(entry, index) in ranked"
							:key="entry.application.id"
							class="border-b dark:border-slate-800"
						>
							<td class="p-3">
								{{ entry.hasData ? index + 1 : "—" }}
							</td>

							<td class="p-3 font-medium">
								{{ fullName(entry.application) }}
							</td>

							<td class="p-3">
								{{ entry.application.offering?.schoolYear || "N/A" }}
							</td>

							<td class="p-3">
								{{ formatValue(entry.value) }}
							</td>

							<td class="p-3">
								<UBadge
									:color="entry.hasData ? 'info' : 'warning'"
									variant="soft"
								>
									{{ entry.hasData ? "For review" : "Incomplete data" }}
								</UBadge>
							</td>
						</tr>

						<tr v-if="!ranked.length">
							<td
								colspan="5"
								class="p-6 text-center text-slate-500"
							>
								No pending or under-review
								{{ program }} applications found on this page.
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<p class="text-xs text-slate-500">
				Review order is calculated from applications currently loaded on this page. It is not an
				official eligibility score or approval decision.
			</p>
		</div>
	</UCard>
</template>
