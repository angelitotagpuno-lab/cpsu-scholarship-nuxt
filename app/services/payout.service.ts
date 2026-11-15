import type {
	Payout,
	PayoutListResponse,
	ClaimablePayoutPayload,
	ReleasePayoutPayload,
} from "~/types/payout";

const api = () => {
	const config = useRuntimeConfig();

	return {
		baseURL: config.public.baseUrl as string,
		credentials: "include" as const,
	};
};

// GET /api/v1/payouts/me
// Authenticated student only
function me(): Promise<PayoutListResponse> {
	return $fetch("/api/v1/payouts/me", {
		...api(),
		method: "GET",
	});
}

// GET /api/v1/payouts/:id
// Admin/personnel only
function show(id: string): Promise<Payout> {
	return $fetch(`/api/v1/payouts/${id}`, {
		...api(),
		method: "GET",
	});
}

// POST /api/v1/payouts/claimable
// Open selected pending payouts
function claimable(body: ClaimablePayoutPayload): Promise<PayoutListResponse> {
	return $fetch("/api/v1/payouts/claimable", {
		...api(),
		method: "POST",
		body,
	});
}

// POST /api/v1/payouts/:id/release
// Student submits check proof
function release(id: string, payload: ReleasePayoutPayload): Promise<Payout> {
	const formData = new FormData();

	formData.append("checkNo", payload.checkNo);

	if (payload.file) {
		formData.append("file", payload.file);
	}

	return $fetch(`/api/v1/payouts/${id}/release`, {
		...api(),
		method: "POST",
		body: formData,
	});
}

export const payoutService = {
	me,
	show,
	claimable,
	release,
};
