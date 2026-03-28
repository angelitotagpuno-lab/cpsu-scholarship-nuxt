import type { Student } from "~/types/student";

const baseUrl = "/proxy";

export function show(id: string): Promise<{ data: Student }> {
	return $fetch(`${baseUrl}/api/students/${id}`, {
		method: "GET",
		credentials: "include",
	});
}

export function update(id: string, data: Student): Promise<{ data: Student }> {
	return $fetch(`${baseUrl}/api/students/${id}`, {
		method: "PUT",
		body: data,
		credentials: "include",
	});
}

export function store(data: Student): Promise<{ data: Student }> {
	return $fetch(`${baseUrl}/api/students`, {
		method: "POST",
		body: data,
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
