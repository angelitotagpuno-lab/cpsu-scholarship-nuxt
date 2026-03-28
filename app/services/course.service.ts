// index, show, store, update, destroy ra naming sa function or son a lang naming sa postman pero mao na for crud
// ayaw pag aync await diri

import type { ApiResponse } from "~/types/api-response";
import type { Course } from "~/types/course";

const baseUrl = "/proxy";

// index pag kuha sa tanan course eso array of objects or strings [{},{}]/['','']
function index(): Promise<ApiResponse<Course[]>> {
	return $fetch(baseUrl + "/api/courses", {
		method: "GET",
		credentials: "include",
	});
}

// show pag kuha sa usa specific course
function show(id: string): Promise<ApiResponse<Course>> {
	return $fetch(baseUrl + `/api/courses/${id}`, {
		credentials: "include",
	});
}

// store pag pasulod sa course
function store(body: Course): Promise<ApiResponse<Course>> {
	return $fetch(baseUrl + "/api/courses", {
		method: "POST",
		body: body,
		credentials: "include",
	});
}

// update page update sa course
function update(id: string, body: Course): Promise<ApiResponse<Course>> {
	return $fetch(baseUrl + `/api/courses/${id}`, {
		method: "PUT",

		body: body,
		credentials: "include",
	});
}

// destroy page delete sa course
function destroy(id: string): Promise<ApiResponse<Course>> {
	return $fetch(baseUrl + `/api/courses/${id}`, {
		method: "DELETE",
		credentials: "include",
	});
}

// export tanan
export const courseService = {
	index,
	show,
	store,
	update,
	destroy,
};
