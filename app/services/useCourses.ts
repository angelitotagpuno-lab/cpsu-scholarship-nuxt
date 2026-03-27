// ~/composables/useCourses.ts
import { useRuntimeConfig } from "#imports";

export function useCourses() {
	const config = useRuntimeConfig();
	const baseUrl = config.public.baseUrl;

	async function fetchCourses() {
		try {
			const courses = await $fetch(baseUrl + "/api/courses", {
				credentials: "include",
			});
			return courses;
		} catch (e) {
			console.error("Failed to fetch courses:", e);
			return [];
		}
	}

	async function addCourse(name: string) {
		return $fetch(baseUrl + "/api/courses", {
			method: "POST",
			body: { name },
			credentials: "include",
		});
	}

	async function editCourse(id: number, name: string) {
		return $fetch(baseUrl + `/api/courses/${id}`, {
			method: "PUT",
			body: { name },
			credentials: "include",
		});
	}

	async function deleteCourse(id: number) {
		return $fetch(baseUrl + `/api/courses/${id}`, {
			method: "DELETE",
			credentials: "include",
		});
	}

	return { fetchCourses, addCourse, editCourse, deleteCourse };
}
