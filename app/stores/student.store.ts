import camelize from "camelize";
import * as StudentService from "~/services/student.service";
import type { Student } from "~/types/student";

export const useStudentStore = defineStore("student", () => {
	const students = ref<Student[]>([]);
	const student = ref<Student | null>(null);
	const isLoading = ref(false);
	const errorMessage = ref("");

	function getErrorMessage(error: any, fallback: string) {
		const data = error?.data || error?.response?._data;

		if (typeof data === "string") {
			try {
				const parsed = JSON.parse(data);
				return parsed?.message || parsed?.statusMessage || data || fallback;
			} catch {
				return data || fallback;
			}
		}

		if (typeof data?.message === "string") return data.message;
		if (typeof data?.statusMessage === "string") return data.statusMessage;
		if (typeof data?.data?.message === "string") return data.data.message;
		if (typeof data?.error?.message === "string") return data.error.message;
		if (typeof error?.message === "string") return error.message;

		return fallback;
	}

	function normalizeStudent(data: unknown): Student {
		return camelize(data) as Student;
	}

	function normalizeStudents(data: unknown): Student[] {
		return camelize(data) as Student[];
	}

	function getStudentId(student?: Student | null) {
		return student?.id || student?.studentId || student?.schoolId || student?.userId || "";
	}

	function getUpdatedStudentFromResponse(response: any, fallback: Student): Student {
		const normalizedBody = normalizeStudent(
			response?.body || response?.data?.body || response?.data || fallback,
		);

		return {
			...normalizedBody,
			id: response?.id || response?.data?.id || fallback.id,
			studentId: normalizedBody.studentId || fallback.studentId,
			schoolId: normalizedBody.schoolId || fallback.schoolId,
			userId: normalizedBody.userId || fallback.userId,
		};
	}

	async function getStudents() {
		isLoading.value = true;
		errorMessage.value = "";

		try {
			const response = await StudentService.index();
			students.value = normalizeStudents(response.data);
		} catch (error: any) {
			errorMessage.value = getErrorMessage(error, "Failed to fetch students");
		} finally {
			isLoading.value = false;
		}
	}

	async function getStudent(id: string) {
		isLoading.value = true;
		errorMessage.value = "";

		try {
			const response = await StudentService.show(id);
			student.value = normalizeStudent(response.data);
		} catch (error: any) {
			errorMessage.value = getErrorMessage(error, "Failed to fetch student");
		} finally {
			isLoading.value = false;
		}
	}

	async function addStudent(data: Student) {
		isLoading.value = true;
		errorMessage.value = "";

		try {
			const response = await StudentService.store(data);
			const createdStudent = normalizeStudent(response.data);

			students.value.unshift(createdStudent);
			return createdStudent;
		} catch (error: any) {
			errorMessage.value = getErrorMessage(error, "Failed to add student");
			return undefined;
		} finally {
			isLoading.value = false;
		}
	}

	async function editStudent(id: string, data: Student) {
		isLoading.value = true;
		errorMessage.value = "";

		try {
			const response = await StudentService.update(id, data);
			const updatedStudent = getUpdatedStudentFromResponse(response, data);
			const updatedId = getStudentId(updatedStudent) || id;

			const index = students.value.findIndex(
				(student) => getStudentId(student) === id || getStudentId(student) === updatedId,
			);

			if (index !== -1) {
				students.value[index] = {
					...students.value[index],
					...updatedStudent,
				};
			}

			return updatedStudent;
		} catch (error: any) {
			errorMessage.value = getErrorMessage(error, "Failed to update student");
			return undefined;
		} finally {
			isLoading.value = false;
		}
	}

	async function deleteStudent(id: string) {
		isLoading.value = true;
		errorMessage.value = "";

		try {
			await StudentService.destroy(id);
			students.value = students.value.filter((student) => getStudentId(student) !== id);
		} catch (error: any) {
			errorMessage.value = getErrorMessage(error, "Failed to delete student");
		} finally {
			isLoading.value = false;
		}
	}

	return {
		students,
		student,
		isLoading,
		errorMessage,
		getStudents,
		getStudent,
		addStudent,
		editStudent,
		deleteStudent,
	};
});
