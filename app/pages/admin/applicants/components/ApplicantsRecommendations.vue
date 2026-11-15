<script setup lang="ts">
import { computed, ref } from "vue";
import type { Application } from "~/types/application";

const props = defineProps<{
	applications: Application[];
}>();

const program = ref<"TES" | "TDP">("TES");

// Convert numeric strings safely
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

// TES: lower GWA means better academic performance
function getGwa(app: Application): number | null {
	const gwa = numericValue(app.gwa);

	if (gwa === null || gwa < 1 || gwa > 5) {
		return null;
	}

	return gwa;
}

// TDP: calculate reported total monthly parent income
function getIncome(app: Application): number | null {
	const parents = app.parents ?? [];

	if (parents.length === 0) return null;

	const incomes = parents.map((parent) => numericValue(parent.monthlyIncome));

	if (incomes.some((income) => income === null)) {
		return null;
	}

	return incomes.reduce<number>((sum, income) => sum + (income ?? 0), 0);
}

// Rank pending applications by selected criterion
const ranked = computed(() => {
	const pending = props.applications.filter(
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
		<div class="space-y-4">
			<div>
				<h2 class="text-lg font-bold">Applicant Review Recommendations</h2>

				<p class="text-sm text-slate-500">
					Preliminary sorting using submitted application data. Final decisions remain with the
					administrator.
				</p>
			</div>

			<!-- PROGRAM SELECTION -->
			<div class="flex flex-wrap gap-2">
				<UButton
					label="TES - Academic Performance"
					:variant="program === 'TES' ? 'solid' : 'outline'"
					@click="program = 'TES'"
				/>

				<UButton
					label="TDP - Family Income"
					:variant="program === 'TDP' ? 'solid' : 'outline'"
					@click="program = 'TDP'"
				/>
			</div>

			<UAlert
				title="Preliminary review only"
				description="Recommendations are based on available application data. Verify the scholarship program, supporting documents, and eligibility requirements before making a final decision."
				color="info"
				variant="soft"
			/>

			<!-- RECOMMENDATION TABLE -->
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead class="border-b dark:border-slate-700">
						<tr>
							<th class="p-3">Review Order</th>
							<th class="p-3">Applicant</th>
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
								colspan="4"
								class="p-6 text-center text-slate-500"
							>
								No pending applications found.
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
