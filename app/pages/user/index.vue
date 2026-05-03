<script setup lang="ts">
definePageMeta({ layout: "user-header" });

const scholarships = [
	{
		title: "TDP Scholarship",
		subtitle: "Tulong Dunong Program",
		description:
			"Financial assistance for qualified students who need support for school expenses and academic requirements.",
		icon: "i-lucide-graduation-cap",
		color: "emerald",
		to: "/user/portal/tdp",
		benefits: "₱7,000 Financial Assistance",
		requirements: [
			"Currently enrolled student",
			"Valid school ID or certificate of registration",
			"Complete personal and family information",
		],
	},
	{
		title: "TES Scholarship",
		subtitle: "Tertiary Education Subsidy",
		description:
			"Educational subsidy for eligible tertiary students to help cover tuition, living allowance, and other school-related costs.",
		icon: "i-lucide-award",
		color: "blue",
		to: "user/portal/tes",
		benefits: "₱10,000 Educational Subsidy",
		requirements: [
			"Qualified tertiary student",
			"Proof of enrollment",
			"Complete student profile and supporting documents",
		],
	},
];

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
						<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Scholarship Offerings</h1>
						<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
							Choose a scholarship program and proceed to the application form.
						</p>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
				<UCard
					v-for="scholarship in scholarships"
					:key="scholarship.title"
					:class="['border shadow-sm', cardClasses(scholarship.color).card]"
				>
					<div class="space-y-5">
						<!-- HEADER -->
						<div class="flex items-start justify-between gap-4">
							<div class="flex items-start gap-3">
								<div :class="['rounded-md p-3', cardClasses(scholarship.color).icon]">
									<UIcon
										:name="scholarship.icon"
										class="size-6"
									/>
								</div>

								<div>
									<h2 class="text-xl font-bold text-slate-900 dark:text-white">
										{{ scholarship.title }}
									</h2>
									<p class="text-sm font-medium text-slate-500 dark:text-slate-400">
										{{ scholarship.subtitle }}
									</p>
								</div>
							</div>

							<span
								:class="[
									'rounded-full px-3 py-1 text-xs font-medium',
									cardClasses(scholarship.color).badge,
								]"
							>
								Open
							</span>
						</div>

						<!-- DESCRIPTION -->
						<p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
							{{ scholarship.description }}
						</p>

						<!-- 💰 BENEFITS (NEW SECTION - CLEAN ADDITION) -->
						<div
							class="rounded-md bg-white/80 p-3 text-center ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-slate-800"
						>
							<p class="text-xs text-slate-500 dark:text-slate-400">Benefits</p>
							<p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">
								{{ scholarship.benefits }}
							</p>
						</div>

						<!-- REQUIREMENTS -->
						<div
							class="rounded-md bg-white/80 p-4 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-slate-800"
						>
							<h3 class="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
								Basic Requirements
							</h3>

							<ul class="space-y-2">
								<li
									v-for="requirement in scholarship.requirements"
									:key="requirement"
									class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
								>
									<UIcon
										name="i-lucide-check-circle-2"
										class="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
									/>
									<span>{{ requirement }}</span>
								</li>
							</ul>
						</div>

						<!-- BUTTON -->
						<div class="flex justify-end">
							<UButton
								:to="scholarship.to"
								icon="i-lucide-file-pen-line"
								color="primary"
								:class="cardClasses(scholarship.color).button"
							>
								Fill Up Form
							</UButton>
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>
*/
