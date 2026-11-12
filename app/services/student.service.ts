import type { Student } from "~/types/student";

const baseUrl = "/proxy";

function index(): Promise<{ data: Student[] }> {
	return $fetch(baseUrl + "/api/students", {
		method: "GET",
		credentials: "include",
	});
}

function show(id: string): Promise<{ data: Student }> {
	return $fetch(baseUrl + `/api/students/${id}`, {
		method: "GET",
		credentials: "include",
	});
}

function store(body: Student): Promise<{ data: Student }> {
	return $fetch(baseUrl + "/api/students", {
		method: "POST",
		body,
		credentials: "include",
	});
}

function update(id: string, body: Student): Promise<{ data: Student }> {
	return $fetch(baseUrl + `/api/students/${id}`, {
		method: "PUT",
		body,
		credentials: "include",
	});
}

function destroy(id: string): Promise<{ data: Student }> {
	return $fetch(baseUrl + `/api/students/${id}`, {
		method: "DELETE",
		credentials: "include",
	});
}

export const studentService = {
	index,
	show,
	store,
	update,
	destroy,
};
