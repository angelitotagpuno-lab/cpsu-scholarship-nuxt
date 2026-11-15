export type ApplicationStatus =
	"pending" | "under_review" | "approved" | "accepted" | "rejected" | "cancelled";

export type ApplicationAddressType = "permanent" | "current";

export type ApplicationParentType = "father" | "mother" | "guardian";

export type ParentVitalStatus = "living" | "deceased" | "unknown";

export interface ApplicationAddress {
	id?: string;
	applicationId?: string;

	type: ApplicationAddressType;
	province: string;
	cityMunicipality: string;
	barangay: string;
	street: string | null;
	zipCode: string;
}

export interface ApplicationParent {
	id?: string;
	applicationId?: string;

	type: ApplicationParentType;
	vitalStatus: ParentVitalStatus;

	firstName: string;
	lastName: string;
	middleName?: string | null;
	extName?: string | null;
	occupation: string;
	monthlyIncome: string;
}

export interface ApplicationCourse {
	id: string;
	name: string;
	abbreviation?: string | null;
	major?: string | null;
}

export interface ApplicationOffering {
	id: string;
	scholarshipProgramId: string;
	schoolYear: string;
	amountPerSemester?: string;
	isActive?: boolean;

	// Optional scholarship program information
	scholarshipProgram?: {
		id: string;
		name: string;
		abbreviation?: string | null;
	} | null;
}

export interface Application {
	id: string;
	studentId: string;
	offeringId?: string;
	courseId?: string;

	firstName: string;
	lastName: string;
	middleName?: string | null;
	extName?: string | null;

	gender?: string;
	birthdate?: string;
	birthplace?: string;
	citizenship?: string;
	email?: string;
	contactNumber?: string;
	yearLevel?: string;
	gwa?: string;
	numberOfSiblings?: string;

	schoolSector?: string;
	schoolName?: string;
	schoolAddress?: string;
	otherFinancialAssistance?: string | null;

	pwdUrl?: string | null;
	ipUrl?: string | null;
	fourPsUrl?: string | null;

	status: ApplicationStatus;

	reviewedBy?: string | null;
	reviewedAt?: string | null;
	yearLevelAtApproval?: string | null;
	expectedGraduationSy?: string | null;
	maxPayoutSy?: string | null;

	createdAt?: string;
	updatedAt?: string;

	addresses?: ApplicationAddress[];
	parents?: ApplicationParent[];
	offering?: ApplicationOffering | null;
	course?: ApplicationCourse | null;
}

export interface ApplicationMeta {
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface ApplicationListResponse {
	data: Application[];
	meta: ApplicationMeta;
}

export interface ApplicationQuery {
	page?: number;
	perPage?: number;
	search?: string;
	sort?: "firstName" | "lastName" | "middleName" | "createdAt";
	order?: "asc" | "desc";
}

export interface CreateApplicationPayload {
	studentId: string;
	offeringId: string;
	courseId: string;

	firstName: string;
	lastName: string;
	middleName?: string;
	extName?: string;

	gender: string;
	birthdate: string;
	birthplace: string;
	citizenship: string;
	email: string;
	contactNumber: string;

	yearLevel: string;
	gwa: string;
	numberOfSiblings: string;

	schoolSector: string;
	schoolName: string;
	schoolAddress: string;
	otherFinancialAssistance?: string | null;

	pwdUrl?: string | null;
	ipUrl?: string | null;
	fourPsUrl?: string | null;

	addresses: {
		type: ApplicationAddressType;
		province: string;
		cityMunicipality: string;
		barangay: string;
		street: string | null;
		zipCode: string;
	}[];

	parents: {
		type: ApplicationParentType;
		vitalStatus: ParentVitalStatus;
		firstName: string;
		lastName: string;
		middleName?: string | null;
		extName?: string | null;
		occupation: string;
		monthlyIncome: string;
	}[];
}
