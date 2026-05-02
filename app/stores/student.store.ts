import { studentService } from "~/services/student.service";
import type { Student } from "~/types/student";

export const useStudentStore = defineStore("student", () => {
	const students = ref<Student[]>([]);
	const student = ref<Student | null>(null);
	const isLoading = ref(false);
	const errorMessage = ref<string | null>(null);

	// GET ALL
	async function getStudents() {
		errorMessage.value = null;
		isLoading.value = true;
		try {
			const res = await studentService.index();
			students.value = res.data;
			console.log("students:", res.data);
		} catch (e) {
			errorMessage.value = "Failed to fetch students";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	// GET ONE
	async function getStudent(id: string) {
		errorMessage.value = null;
		isLoading.value = true;
		try {
			const res = await studentService.show(id);
			student.value = res.data;
		} catch (e) {
			errorMessage.value = "Failed to fetch student";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	// ADD
	async function addStudent(body: Student) {
		errorMessage.value = null;
		isLoading.value = true;
		try {
			const res = await studentService.store(body);
			student.value = res.data;
			await getStudents(); // refresh list
		} catch (e) {
			errorMessage.value = "Failed to add student";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	// UPDATE (PUT)
	async function editStudent(id: string, body: Student) {
		errorMessage.value = null;
		isLoading.value = true;
		try {
			const res = await studentService.update(id, body);
			student.value = res.data;
			await getStudents(); // same as course ✅
		} catch (e) {
			errorMessage.value = "Failed to update student";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	// DELETE
	async function deleteStudent(id: string) {
		errorMessage.value = null;
		isLoading.value = true;
		try {
			const res = await studentService.destroy(id);
			student.value = res.data;
			await getStudents(); // refresh
		} catch (e) {
			errorMessage.value = "Failed to delete student";
			console.error(e);
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
