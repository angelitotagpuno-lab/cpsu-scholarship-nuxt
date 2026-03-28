// dapat pag mo import sa courseService ingon ani para dali ra copy paste ang code sa uban

import { courseService } from "~/services/course.service";
import type { Course } from "~/types/course";

// get, add, edit, delete ray gamiton sa store ang iban depende sa use-case pero sa basic crud mao na
export const useCourseStore = defineStore("course", () => {
	const courses = ref<Course[]>([]);
	const course = ref<Course | null>(null);
	const isLoading = ref(false);
	const errorMessage = ref<string | null>(null);

	// pag dagahan nay s
	async function getCourses() {
		errorMessage.value = null;
		isLoading.value = true;
		try {
			const res = await courseService.index();
			courses.value = res.data;
		} catch (e) {
			errorMessage.value = "Failed to fetch courses";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	// basta isa walay s ayaw pag buta2 dira
	async function getCourse(id: string) {
		errorMessage.value = null;
		isLoading.value = true;
		try {
			const res = await courseService.show(id);
			course.value = res.data;
		} catch (e) {
			errorMessage.value = "Failed to fetch course";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	async function addCourse(body: Course) {
		errorMessage.value = null;
		isLoading.value = true;
		try {
			const res = await courseService.store(body);
			course.value = res.data;
			await getCourses();
		} catch (e) {
			errorMessage.value = "Failed to add course";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	async function editCourse(id: string, body: Course) {
		errorMessage.value = null;
		isLoading.value = true;
		try {
			const res = await courseService.update(id, body);
			course.value = res.data;
			await getCourses();
		} catch (e) {
			errorMessage.value = "Failed to update course";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	async function deleteCourse(id: string) {
		errorMessage.value = null;
		isLoading.value = true;
		try {
			const res = await courseService.destroy(id);
			course.value = res.data;
			await getCourses();
		} catch (e) {
			errorMessage.value = "Failed to delete course";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	return {
		courses,
		course,
		isLoading,
		errorMessage,
		getCourses,
		getCourse,
		addCourse,
		editCourse,
		deleteCourse,
	};
});
