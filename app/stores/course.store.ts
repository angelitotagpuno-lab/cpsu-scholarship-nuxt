import { courseService } from "~/services/course.service";
import type { Course, CourseBody, CourseQuery } from "~/types/course";

export const useCourseStore = defineStore("course", () => {
	const courses = ref<Course[]>([]);
	const course = ref<Course | null>(null);
	const isLoading = ref(false);
	const errorMessage = ref<string | null>(null);

	const page = ref(1);
	const perPage = ref(20);
	const total = ref(0);
	const totalPages = ref(0);
	const hasNext = ref(false);
	const hasPrev = ref(false);
	const search = ref("");

	async function getCourses(query: CourseQuery = {}) {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			const res = await courseService.index({
				page: query.page ?? page.value,
				perPage: query.perPage ?? perPage.value,
				search: query.search ?? search.value,
				sort: query.sort ?? "name",
				order: query.order ?? "asc",
			});

			courses.value = res.data;
			page.value = res.meta.page;
			perPage.value = res.meta.perPage;
			total.value = res.meta.total;
			totalPages.value = res.meta.totalPages;
			hasNext.value = res.meta.hasNext;
			hasPrev.value = res.meta.hasPrev;
		} catch (e) {
			errorMessage.value = "Failed to fetch courses";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	async function getCourse(id: string) {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			course.value = await courseService.show(id);
		} catch (e) {
			errorMessage.value = "Failed to fetch course";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	async function addCourse(body: CourseBody) {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			course.value = await courseService.store(body);
			await getCourses({ page: 1 });
		} catch (e) {
			errorMessage.value = "Failed to add course";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	async function editCourse(id: string, body: CourseBody) {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			course.value = await courseService.update(id, body);
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
			await courseService.destroy(id);
			course.value = null;

			const nextPage = courses.value.length === 1 && page.value > 1 ? page.value - 1 : page.value;

			await getCourses({ page: nextPage });
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
		page,
		perPage,
		total,
		totalPages,
		hasNext,
		hasPrev,
		search,
		getCourses,
		getCourse,
		addCourse,
		editCourse,
		deleteCourse,
	};
});
