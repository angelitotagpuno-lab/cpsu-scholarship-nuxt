export interface Payout {
	id: string;
	applicationId: string;
	semester: string;
	amount: string;
	status: string;
	isClaimable: boolean;
	claimableBy: string | null;
	claimableAt: string | null;
	checkNo: string | null;
	checkImageUrl: string | null;
	releasedBy: string | null;
	releasedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface PayoutListResponse {
	data: Payout[];
}

export interface ClaimablePayoutPayload {
	ids: string[];
}

export interface ReleasePayoutPayload {
	checkNo: string;
	file?: File | null;
}

// For your existing liquidation table
export interface LiquidationRecord {
	id: string;
	date: string;
	checkNo: string;
	dvPayrollNo: string;
	name: string;
	pwd: string;
	purpose: string;
	amount: number;
	status: string;
}
