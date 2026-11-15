export type AnalyticsMetric =
	| "total_students"
	| "approved_scholars"
	| "pending_applications"
	| "approved_applications"
	| "registered_allowlist"
	| "applications_by_status"
	| "applications_by_course"
	| "applications_by_offering"
	| "applications_by_school_year"
	| "applications_over_time"
	| "eligibility_prediction_runs";

export interface AnalyticsMetricDefinition {
	id: string;
	label: string;
	description: string;
	resultType: string;
	allowedRoles: string[];
	supportedFilters: string[];
	supportedGroupBy: string[];
	supportedBuckets: string[];
	chatEnabled: boolean;
}

export interface AnalyticsFilters {
	offeringId?: string;
	programId?: string;
	courseId?: string;
	schoolYear?: string;
	status?: string;
	from?: string;
	to?: string;
}

export interface AnalyticsQueryPayload {
	metric: AnalyticsMetric;
	filters?: AnalyticsFilters;
	groupBy?: "status" | "course" | "offering" | "schoolYear";
	bucket?: "day" | "month" | "year";
}

export interface AnalyticsResult {
	type: string;
	label?: string;
	value?: number;
	total?: number;
	count?: number;
	unit?: string;
	[key: string]: unknown;
}

export interface AnalyticsResponse {
	answer: string;
	metric?: string;
	result?: AnalyticsResult;
	filters?: AnalyticsFilters;
	generatedAt?: string;
	unsupportedReason?: string | null;
}

export interface AnalyticsChatMessage {
	role: "user" | "assistant";
	content: string;
}

export interface AnalyticsChatPayload {
	message: string;
	history?: AnalyticsChatMessage[];
}

export interface AnalyticsMetricsResponse {
	data: AnalyticsMetricDefinition[];
}
