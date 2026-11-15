import type {
	AnalyticsMetricsResponse,
	AnalyticsQueryPayload,
	AnalyticsResponse,
	AnalyticsChatPayload,
} from "~/types/analytics";

const api = () => {
	const config = useRuntimeConfig();

	return {
		baseURL: config.public.baseUrl as string,
		credentials: "include" as const,
	};
};

// GET /api/v1/analytics/metrics
function metrics(): Promise<AnalyticsMetricsResponse> {
	return $fetch("/api/v1/analytics/metrics", {
		...api(),
		method: "GET",
	});
}

// POST /api/v1/analytics/query
function query(body: AnalyticsQueryPayload): Promise<AnalyticsResponse> {
	return $fetch("/api/v1/analytics/query", {
		...api(),
		method: "POST",
		body,
	});
}

// POST /api/v1/analytics/chat
function chat(body: AnalyticsChatPayload): Promise<AnalyticsResponse> {
	return $fetch("/api/v1/analytics/chat", {
		...api(),
		method: "POST",
		body,
	});
}

export const analyticsService = {
	metrics,
	query,
	chat,
};
