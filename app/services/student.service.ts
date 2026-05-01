import type { Student } from "~/types/student";

const baseUrl = "/proxy";

function clean(value?: string) {
	return value && value !== "undefined" ? value : "";
}

function toStudentPayload(data: Student) {
	const studentId = data.userId || data.id || data.studentId || data.schoolId;

	return {
		user_id: studentId,
		first_name: data.firstName,
		last_name: data.lastName,
		middle_name: clean(data.middleName),
		ext_name: clean(data.extName),
		email: clean(data.email),
		birthdate: data.birthdate,
		contact_number: data.contactNumber,
		sex: data.sex,
		year_level: Number(data.yearLevel),
		course_id: data.courseId,

		address: {
			student_id: studentId,
			street: clean(data.address?.street),
			barangay: data.address?.barangay,
			city: data.address?.city,
			province: data.address?.province,
			zipcode: clean(data.address?.zipcode),
		},

		parents: data.parents.map((parent) => ({
			student_id: studentId,
			type: parent.type,
			first_name: parent.firstName,
			last_name: parent.lastName,
			middle_name: clean(parent.middleName),
			ext_name: clean(parent.extName),
			occupation: clean(parent.occupation),
			monthly_income: clean(parent.monthlyIncome),
			contact_number: clean(parent.contactNumber),
			email: clean(parent.email),
		})),
	};
}

export function show(id: string): Promise<{ data: Student }> {
	return $fetch(`${baseUrl}/api/students/${id}`, {
		method: "GET",
		credentials: "include",
	});
}

export function update(id: string, data: Student): Promise<any> {
	return $fetch(`${baseUrl}/api/students/${id}`, {
		method: "PUT",
		body: toStudentPayload(data),
		credentials: "include",
	});
}

export function store(data: Student): Promise<{ data: Student }> {
	return $fetch(`${baseUrl}/api/students`, {
		method: "POST",
		body: toStudentPayload(data),
		credentials: "include",
	});
}

export function index(): Promise<{ data: Student[] }> {
	return $fetch(`${baseUrl}/api/students`, {
		method: "GET",
		credentials: "include",
	});
}

export function destroy(id: string): Promise<{ data: Student }> {
	return $fetch(`${baseUrl}/api/students/${id}`, {
		method: "DELETE",
		credentials: "include",
	});
}
