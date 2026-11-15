<script setup lang="ts">
definePageMeta({
	layout: "user-header",
});

type Scholarship = {
	title: string;
	subtitle: string;
	description: string;
	icon: string;
	color: "emerald" | "blue";
	benefits: string;
	requirements: string[];
	to: string;
};

const scholarships: Scholarship[] = [
	{
		title: "TDP Scholarship",
		subtitle: "Tulong Dunong Program",
		description:
			"Financial assistance designed to support qualified students with their educational expenses and academic needs.",
		icon: "i-lucide-graduation-cap",
		color: "emerald",
		benefits: "₱7,000",
		to: "/user/scholarships",
		requirements: [
			"Currently enrolled student",
			"Valid school ID or Certificate of Registration",
			"Complete personal and family information",
			"Required supporting documents",
		],
	},
	{
		title: "TES Scholarship",
		subtitle: "Tertiary Education Subsidy",
		description:
			"Educational subsidy intended to assist eligible tertiary students with school-related expenses.",
		icon: "i-lucide-award",
		color: "blue",
		benefits: "₱10,000",
		to: "/user/scholarships",
		requirements: [
			"Qualified tertiary student",
			"Proof of enrollment",
			"Complete student profile",
			"Required supporting documents",
		],
	},
];

function cardClasses(color: Scholarship["color"]) {
	if (color === "emerald") {
		return {
			card: "border-emerald-200 dark:border-emerald-900",
			header: "bg-emerald-50 dark:bg-emerald-950/30",
			icon: "bg-emerald-600 text-white",
			text: "text-emerald-700 dark:text-emerald-400",
			badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
			border: "border-emerald-200 dark:border-emerald-900",
		};
	}

	return {
		card: "border-blue-200 dark:border-blue-900",
		header: "bg-blue-50 dark:bg-blue-950/30",
		icon: "bg-blue-600 text-white",
		text: "text-blue-700 dark:text-blue-400",
		badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
		border: "border-blue-200 dark:border-blue-900",
	};
}
</script>

<template>
	<div class="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-6xl space-y-7">
			<!-- WELCOME HEADER -->
			<div
				class="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-900 p-6 text-white shadow-sm sm:p-8"
			>
				<div class="relative z-10 max-w-3xl space-y-3">
					<div class="flex items-center gap-2">
						<UIcon
							name="i-lucide-graduation-cap"
							class="size-6"
						/>

						<span class="text-sm font-medium text-emerald-100"> CPSU San Carlos Campus </span>
					</div>

					<h1 class="text-2xl font-bold sm:text-3xl">Welcome to the Scholarship Portal</h1>

					<p class="text-sm leading-6 text-emerald-100 sm:text-base">
						Explore scholarship opportunities, review program requirements, and begin your
						scholarship application.
					</p>

					<div class="pt-2">
						<UButton
							to="/user/scholarships"
							label="Explore Available Scholarships"
							icon="i-lucide-arrow-right"
							trailing
							color="neutral"
							variant="solid"
							size="lg"
						/>
					</div>
				</div>

				<UIcon
					name="i-lucide-graduation-cap"
					class="pointer-events-none absolute -bottom-12 -right-10 size-64 rotate-[-15deg] text-white/10"
				/>
			</div>

			<!-- INFORMATION -->
			<UAlert
				icon="i-lucide-info"
				title="Before You Apply"
				description="Please prepare your student information and supporting documents. Scholarship applications are subject to eligibility review and administrator approval."
				color="info"
				variant="soft"
			/>

			<!-- SECTION HEADER -->
			<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h2 class="text-xl font-bold text-slate-900 dark:text-white">Scholarship Programs</h2>

					<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
						Learn more about the scholarship programs offered through the CPSU Scholarship Portal.
					</p>
				</div>

				<UBadge
					color="neutral"
					variant="soft"
					size="lg"
				>
					2 Scholarship Programs
				</UBadge>
			</div>

			<!-- SCHOLARSHIP CARDS -->
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<UCard
					v-for="scholarship in scholarships"
					:key="scholarship.title"
					:class="['overflow-hidden border shadow-sm', cardClasses(scholarship.color).card]"
					:ui="{
						body: 'p-0 sm:p-0',
					}"
				>
					<div class="flex h-full flex-col">
						<!-- CARD HEADER -->
						<div
							class="border-b p-5 sm:p-6"
							:class="[
								cardClasses(scholarship.color).header,
								cardClasses(scholarship.color).border,
							]"
						>
							<div class="flex items-start justify-between gap-3">
								<div
									class="flex size-14 shrink-0 items-center justify-center rounded-xl shadow-sm"
									:class="cardClasses(scholarship.color).icon"
								>
									<UIcon
										:name="scholarship.icon"
										class="size-7"
									/>
								</div>

								<span
									class="rounded-full px-3 py-1 text-xs font-semibold"
									:class="cardClasses(scholarship.color).badge"
								>
									Scholarship Program
								</span>
							</div>

							<h3 class="mt-4 text-xl font-bold text-slate-900 dark:text-white">
								{{ scholarship.title }}
							</h3>

							<p
								class="mt-1 text-sm font-medium"
								:class="cardClasses(scholarship.color).text"
							>
								{{ scholarship.subtitle }}
							</p>
						</div>

						<!-- CARD BODY -->
						<div class="flex flex-1 flex-col space-y-5 p-5 sm:p-6">
							<!-- DESCRIPTION -->
							<p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
								{{ scholarship.description }}
							</p>

							<!-- BENEFITS -->
							<div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
								<div class="flex items-center gap-3">
									<div
										class="flex size-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-900"
									>
										<UIcon
											name="i-lucide-wallet"
											class="size-5"
											:class="cardClasses(scholarship.color).text"
										/>
									</div>

									<div>
										<p class="text-xs font-medium text-slate-500 dark:text-slate-400">
											Program Assistance
										</p>

										<p
											class="text-xl font-bold"
											:class="cardClasses(scholarship.color).text"
										>
											{{ scholarship.benefits }}
										</p>
									</div>
								</div>
							</div>

							<!-- REQUIREMENTS -->
							<div class="flex-1">
								<div class="mb-4 flex items-center gap-2">
									<UIcon
										name="i-lucide-clipboard-list"
										class="size-5 text-slate-500"
									/>

									<h4 class="text-sm font-semibold text-slate-900 dark:text-white">
										Basic Requirements
									</h4>
								</div>

								<ul class="space-y-3">
									<li
										v-for="requirement in scholarship.requirements"
										:key="requirement"
										class="flex items-start gap-3"
									>
										<UIcon
											name="i-lucide-check-circle-2"
											class="mt-0.5 size-4 shrink-0"
											:class="cardClasses(scholarship.color).text"
										/>

										<span class="text-sm leading-5 text-slate-600 dark:text-slate-300">
											{{ requirement }}
										</span>
									</li>
								</ul>
							</div>

							<!-- ACTION -->
							<div class="space-y-3 border-t border-slate-200 pt-5 dark:border-slate-800">
								<UButton
									:to="scholarship.to"
									label="View Available Scholarships"
									icon="i-lucide-arrow-right"
									trailing
									block
									size="lg"
									color="primary"
								/>

								<p class="text-center text-xs text-slate-500 dark:text-slate-400">
									Check active offerings before applying.
								</p>
							</div>
						</div>
					</div>
				</UCard>
			</div>

			<!-- APPLICATION PROCESS -->
			<div
				class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
			>
				<div class="mb-6">
					<h2 class="text-lg font-bold text-slate-900 dark:text-white">How to Apply</h2>

					<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
						Follow these steps to submit your scholarship application.
					</p>
				</div>

				<div class="grid gap-5 md:grid-cols-3">
					<div class="flex items-start gap-3">
						<div
							class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
						>
							<UIcon
								name="i-lucide-search"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-sm font-semibold">1. Choose a Scholarship</h3>

							<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
								Explore available TES and TDP scholarship offerings.
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<div
							class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
						>
							<UIcon
								name="i-lucide-file-pen-line"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-sm font-semibold">2. Complete the Application</h3>

							<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
								Fill out the application form and upload the required documents.
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<div
							class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400"
						>
							<UIcon
								name="i-lucide-clipboard-check"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-sm font-semibold">3. Wait for Review</h3>

							<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
								Your application will be reviewed by the scholarship administrator.
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- FOOTER -->
			<p class="pb-4 text-center text-xs text-slate-500 dark:text-slate-400">
				Central Philippines State University – San Carlos Campus Scholarship Management System
			</p>
		</div>
	</div>
</template>
