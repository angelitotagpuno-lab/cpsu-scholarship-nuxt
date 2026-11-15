export interface Scholar {
	id: string;
	no: number;
	scholarshipType: "TDP" | "TES" | "Unknown";
	lastName: string;
	firstName: string;
	middleInitial: string;
	course: string;
	yearLevel: string;
	semester: string;
	enrolled: string;
}
