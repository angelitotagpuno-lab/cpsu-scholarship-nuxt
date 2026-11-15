import type { Course, CourseBody, CourseQuery, CourseListResponse } from "~/types/course";

const api = () => {
	const config = useRuntimeConfig();

	return {
		baseURL: config.public.baseUrl,
		credentials: "include" as const,
	};
};

function index(query: CourseQuery = {}): Promise<CourseListResponse> {
	return $fetch("/api/v1/courses", {
		...api(),
		method: "GET",
		query,
	});
}

function show(id: string): Promise<Course> {
	return $fetch(`/api/v1/courses/${id}`, {
		...api(),
		method: "GET",
	});
}

function store(body: CourseBody): Promise<Course> {
	return $fetch("/api/v1/courses", {
		...api(),
		method: "POST",
		body,
	});
}

function update(id: string, body: CourseBody): Promise<Course> {
	return $fetch(`/api/v1/courses/${id}`, {
		...api(),
		method: "PUT",
		body,
	});
}

function destroy(id: string): Promise<void> {
	return $fetch(`/api/v1/courses/${id}`, {
		...api(),
		method: "DELETE",
	});
}

export const courseService = {
	index,
	show,
	store,
	update,
	destroy,
};
