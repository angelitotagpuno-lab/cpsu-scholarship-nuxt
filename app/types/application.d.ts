/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApplicationStatus = "pending" | "under_review" | "approved" | "rejected" | "cancelled";

export interface Application {
	id: string;

	studentId: string;
	offeringId: string;

	status: ApplicationStatus;
	reason?: string | null;

	createdAt?: string;
	updatedAt?: string;

	profile: {
		firstName: string;
		lastName: string;
		birthdate: string;
		birthplace: string;
		contactNumber: string;
		sex: string;
		yearLevel: string;
		courseId?: string;

		address: {
			street: string;
			barangay: string;
			city: string;
			province: string;
			zipcode: string; // ✅ now valid
		};

		parents: Array<{
			type: string;
			firstName: string;
			lastName: string;
			status?: string;
		}>;
	};

	extraAnswers: Record<string, any>;
	documents: Array<any>;
}
