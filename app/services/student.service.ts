import type { Student } from "~/types/student";

const config = useRuntimeConfig();
const headers = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;

export const showStudent = (id: string): Promise<Student> => {
	return $fetch(`${config.public.baseUrl}/api/student/${id}`, {
		method: "GET",
		headers,
		credentials: "include",
	});
};

export const updateStudent = (id: string, data: Student) => {
	return $fetch(`${config.public.baseUrl}/api/student/${id}`, {
		method: "PUT",
		body: data,
		headers,
		credentials: "include",
	});
};

export const insertStudent = (data: Student) => {
	return $fetch(`${config.public.baseUrl}/api/student`, {
		method: "POST",
		body: data,
		headers,
		credentials: "include",
	});
};
