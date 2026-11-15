<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAnalyticsStore } from "~/stores/analytics.store";
import { useAdminApplicationStore } from "~/stores/application.store";

const analytics = useAnalyticsStore();
const applicationStore = useAdminApplicationStore();

const question = ref("");

const totalApplications = computed(() => applicationStore.meta?.total ?? null);

const cards = computed(() => [
	{
		label: "Registered Students",
		description: "Students registered in the system",
		metric: "total_students" as const,
		icon: "i-lucide-users",
		color: "text-blue-600 dark:text-blue-400",
		background: "bg-blue-50 dark:bg-blue-950/40",
	},
	{
		label: "Pending Applications",
		description: "Applications waiting for review",
		metric: "pending_applications" as const,
		icon: "i-lucide-clock-3",
		color: "text-amber-600 dark:text-amber-400",
		background: "bg-amber-50 dark:bg-amber-950/40",
	},
	{
		label: "Approved Applications",
		description: "Applications that have been approved",
		metric: "approved_applications" as const,
		icon: "i-lucide-clipboard-check",
		color: "text-emerald-600 dark:text-emerald-400",
		background: "bg-emerald-50 dark:bg-emerald-950/40",
	},
	{
		label: "Approved Scholars",
		description: "Students recognized as scholars",
		metric: "approved_scholars" as const,
		icon: "i-lucide-graduation-cap",
		color: "text-violet-600 dark:text-violet-400",
		background: "bg-violet-50 dark:bg-violet-950/40",
	},
]);

const suggestedQuestions = [
	"How many applications are pending?",
	"How many applications have been approved?",
	"How many approved scholars are there?",
	"How many students are registered?",
];

const isRefreshing = ref(false);

async function loadAnalytics() {
	isRefreshing.value = true;

	try {
		const success = await analytics.fetchMetrics();

		if (success) {
			await analytics.fetchStatistics();
		}
	} finally {
		isRefreshing.value = false;
	}
}

async function sendQuestion(message?: string) {
	const text = (message ?? question.value).trim();

	if (!text || analytics.isChatting) return;

	const success = await analytics.askAnalytics(text);

	if (success) {
		question.value = "";
	}
}

function getMetricValue(
	metric: "total_students" | "pending_applications" | "approved_applications" | "approved_scholars",
): string {
	const value = analytics.results[metric]?.result?.value;

	if (typeof value !== "number") {
		return "—";
	}

	return value.toLocaleString("en-PH");
}

onMounted(() => {
	loadAnalytics();
});
</script>

<template>
	<div class="space-y-6">
		<!-- HEADER -->
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<div class="flex items-center gap-2">
					<div
						class="flex size-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30"
					>
						<UIcon
							name="i-lucide-chart-no-axes-combined"
							class="size-5 text-emerald-600 dark:text-emerald-400"
						/>
					</div>

					<div>
						<h2 class="text-lg font-bold text-slate-900 dark:text-white">Scholarship Overview</h2>

						<p class="text-sm text-slate-500 dark:text-slate-400">
							Stay informed about student applications and scholarship progress.
						</p>
					</div>
				</div>
			</div>

			<UButton
				label="Refresh Overview"
				icon="i-lucide-refresh-cw"
				color="neutral"
				variant="outline"
				:loading="isRefreshing"
				@click="loadAnalytics"
			/>
		</div>

		<!-- SUMMARY CARDS -->
		<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
			<!-- TOTAL APPLICATIONS -->
			<UCard class="shadow-sm">
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<div
							class="flex size-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40"
						>
							<UIcon
								name="i-lucide-files"
								class="size-6 text-emerald-600 dark:text-emerald-400"
							/>
						</div>
					</div>

					<div>
						<p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Applications</p>

						<p class="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
							{{ totalApplications?.toLocaleString("en-PH") ?? "—" }}
						</p>

						<p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
							Scholarship applications received
						</p>
					</div>
				</div>
			</UCard>

			<!-- ANALYTICS CARDS -->
			<UCard
				v-for="card in cards"
				:key="card.metric"
				class="shadow-sm"
			>
				<div class="space-y-3">
					<div
						class="flex size-11 items-center justify-center rounded-xl"
						:class="card.background"
					>
						<UIcon
							:name="card.icon"
							class="size-6"
							:class="card.color"
						/>
					</div>

					<div>
						<p class="text-sm font-medium text-slate-500 dark:text-slate-400">
							{{ card.label }}
						</p>

						<p class="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
							{{ getMetricValue(card.metric) }}
						</p>

						<p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
							{{ card.description }}
						</p>
					</div>
				</div>
			</UCard>
		</div>

		<!-- FRIENDLY LOADING ERROR -->
		<UAlert
			v-if="analytics.errorMessage"
			icon="i-lucide-info"
			title="Some information is temporarily unavailable"
			description="We couldn't load the latest scholarship statistics. Please refresh the overview or try again in a moment."
			color="warning"
			variant="soft"
		/>

		<!-- SCHOLARSHIP ASSISTANT -->
		<UCard class="shadow-sm">
			<div class="space-y-5">
				<!-- ASSISTANT HEADER -->
				<div class="flex items-start gap-3">
					<div
						class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30"
					>
						<UIcon
							name="i-lucide-message-circle"
							class="size-6 text-emerald-600 dark:text-emerald-400"
						/>
					</div>

					<div>
						<h3 class="text-base font-bold text-slate-900 dark:text-white">
							Scholarship Assistant
						</h3>

						<p class="text-sm text-slate-500 dark:text-slate-400">
							Have questions about scholarship applications? Ask below to get information from
							available scholarship records.
						</p>
					</div>
				</div>

				<!-- WELCOME MESSAGE -->
				<div
					v-if="!analytics.chatHistory.length"
					class="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50"
				>
					<div class="flex items-start gap-3">
						<UIcon
							name="i-lucide-sparkles"
							class="mt-1 size-5 text-emerald-600"
						/>

						<div class="space-y-2">
							<p class="font-semibold text-slate-900 dark:text-white">
								Welcome to your Scholarship Assistant!
							</p>

							<p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
								I can help you check the number of pending applications, approved applications,
								registered students, and scholars. Choose a question below or type your own.
							</p>
						</div>
					</div>
				</div>

				<!-- SUGGESTED QUESTIONS -->
				<div class="space-y-2">
					<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
						Suggested Questions
					</p>

					<div class="flex flex-wrap gap-2">
						<UButton
							v-for="suggestion in suggestedQuestions"
							:key="suggestion"
							:label="suggestion"
							color="neutral"
							variant="outline"
							size="sm"
							:disabled="analytics.isChatting"
							@click="sendQuestion(suggestion)"
						/>
					</div>
				</div>

				<!-- CONVERSATION -->
				<div
					v-if="analytics.chatHistory.length"
					class="max-h-96 space-y-4 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40"
				>
					<div
						v-for="(message, index) in analytics.chatHistory"
						:key="index"
						class="flex"
						:class="message.role === 'user' ? 'justify-end' : 'justify-start'"
					>
						<div
							class="max-w-[90%] rounded-xl px-4 py-3 text-sm leading-relaxed sm:max-w-[80%]"
							:class="
								message.role === 'user'
									? 'bg-emerald-600 text-white'
									: 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
							"
						>
							<p class="mb-1 text-xs font-semibold opacity-75">
								{{ message.role === "user" ? "You" : "Scholarship Assistant" }}
							</p>

							<p class="whitespace-pre-wrap">
								{{ message.content }}
							</p>
						</div>
					</div>

					<div
						v-if="analytics.isChatting"
						class="flex items-center gap-2 text-sm text-slate-500"
					>
						<UIcon
							name="i-lucide-loader-circle"
							class="size-4 animate-spin"
						/>
						Checking scholarship records...
					</div>
				</div>

				<!-- FRIENDLY CHAT ERROR -->
				<UAlert
					v-if="analytics.chatError"
					icon="i-lucide-message-circle-warning"
					title="We couldn't answer your question"
					description="Please try asking again in a moment. You can also choose one of the suggested questions above."
					color="warning"
					variant="soft"
				/>

				<!-- QUESTION INPUT -->
				<div class="flex flex-col gap-3 sm:flex-row">
					<UInput
						v-model="question"
						icon="i-lucide-message-square"
						placeholder="Type your scholarship question here..."
						class="w-full flex-1"
						size="lg"
						:maxlength="1000"
						:disabled="analytics.isChatting"
						@keyup.enter="sendQuestion()"
					/>

					<UButton
						label="Ask Question"
						icon="i-lucide-send"
						color="success"
						size="lg"
						:loading="analytics.isChatting"
						:disabled="!question.trim() || analytics.isChatting"
						@click="sendQuestion()"
					/>
				</div>

				<p class="text-xs text-slate-500 dark:text-slate-400">
					Responses are based on available scholarship records. Please verify important information
					before making decisions.
				</p>
			</div>
		</UCard>
	</div>
</template>
