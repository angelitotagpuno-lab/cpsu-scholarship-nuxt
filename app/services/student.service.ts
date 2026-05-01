import type { Student } from "~/types/student";

const baseUrl = "/proxy";

function toStudentPayload(data: Student) {
	return {
		school_id: data.schoolId || data.studentId,
		first_name: data.firstName,
		last_name: data.lastName,
		middle_name: data.middleName,
		ext_name: data.extName,
		birthdate: data.birthdate,
		contact_number: data.contactNumber,
		sex: data.sex,
		year_level: data.yearLevel,
		address: data.address,
		parents: data.parents.map((parent) => ({
			type: parent.type,
			first_name: parent.firstName,
			last_name: parent.lastName,
			middle_name: parent.middleName,
			contact_number: parent.contactNumber,
			occupation: parent.occupation,
		})),
	};
}

export function show(id: string): Promise<{ data: Student }> {
	return $fetch(`${baseUrl}/api/students/${id}`, {
		method: "GET",
		credentials: "include",
	});
}

export function update(id: string, data: Student): Promise<{ data: Student }> {
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
