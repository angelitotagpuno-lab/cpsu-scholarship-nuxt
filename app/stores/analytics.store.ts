import { defineStore } from "pinia";
import { ref } from "vue";
import { analyticsService } from "~/services/analytics.service";

import type {
	AnalyticsMetric,
	AnalyticsMetricDefinition,
	AnalyticsResponse,
	AnalyticsChatMessage,
	AnalyticsFilters,
} from "~/types/analytics";

export const useAnalyticsStore = defineStore("analytics", () => {
	const metrics = ref<AnalyticsMetricDefinition[]>([]);
	const results = ref<Partial<Record<AnalyticsMetric, AnalyticsResponse>>>({});

	const chatHistory = ref<AnalyticsChatMessage[]>([]);
	const chatAnswer = ref("");
	const chatError = ref<string | null>(null);

	const isLoading = ref(false);
	const isChatting = ref(false);
	const errorMessage = ref<string | null>(null);

	function getError(error: unknown): string {
		const e = error as {
			status?: number;
			statusCode?: number;
			data?: {
				message?: string;
				detail?: string;
			};
			message?: string;
		};

		const status = e.status ?? e.statusCode;

		if (status === 401) {
			return "Session expired. Please log in again.";
		}

		if (status === 403) {
			return "You do not have permission to access analytics.";
		}

		return e.data?.message || e.data?.detail || e.message || "Analytics request failed.";
	}

	async function fetchMetrics() {
		errorMessage.value = null;

		try {
			const response = await analyticsService.metrics();
			metrics.value = response.data ?? [];
			return true;
		} catch (error) {
			errorMessage.value = getError(error);
			return false;
		}
	}

	async function fetchStatistics(filters: AnalyticsFilters = {}) {
		isLoading.value = true;
		errorMessage.value = null;

		const requested: AnalyticsMetric[] = [
			"total_students",
			"pending_applications",
			"approved_applications",
			"approved_scholars",
		];

		try {
			const responses = await Promise.all(
				requested.map((metric) =>
					analyticsService.query({
						metric,
						filters,
					}),
				),
			);

			requested.forEach((metric, index) => {
				const response = responses[index];

				if (response) {
					results.value[metric] = response;
				}
			});

			return true;
		} catch (error) {
			errorMessage.value = getError(error);
			return false;
		} finally {
			isLoading.value = false;
		}
	}

	async function askAnalytics(message: string) {
		const question = message.trim();

		if (!question) return false;

		isChatting.value = true;
		chatError.value = null;

		try {
			const response = await analyticsService.chat({
				message: question,
				history: chatHistory.value.slice(-20),
			});

			chatAnswer.value = response.answer;

			chatHistory.value.push(
				{ role: "user", content: question },
				{
					role: "assistant",
					content: response.answer,
				},
			);

			chatHistory.value = chatHistory.value.slice(-20);

			return true;
		} catch (error) {
			chatError.value = getError(error);
			return false;
		} finally {
			isChatting.value = false;
		}
	}

	return {
		metrics,
		results,
		chatHistory,
		chatAnswer,
		chatError,
		isLoading,
		isChatting,
		errorMessage,
		fetchMetrics,
		fetchStatistics,
		askAnalytics,
	};
});
