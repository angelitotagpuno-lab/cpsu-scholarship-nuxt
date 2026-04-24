export type TdpApplicant = {
	id?: string;

	// student
	lastName: string;
	firstName: string;
	middleName: string;
	maidenName: string;
	birthdate: string;
	sex: string;
	birthPlace: string;
	citizenship: string;
	mobile: string;
	email: string;

	// address
	street: string;
	city: string;
	province: string;
	zipCode: string;

	// school
	schoolName: string;
	schoolId: string;
	schoolAddress: string;
	schoolSector: string;
	yearLevel: string;
	course: string;

	// parents
	fatherName: string;
	fatherOccupation: string;
	fatherStatus: string;

	motherName: string;
	motherOccupation: string;
	motherStatus: string;

	// family
	income: string;
	siblings: string;
	financialAid: string;

	created_at?: string;
};
