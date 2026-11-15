import { defineStore } from "pinia";
import { ref } from "vue";

import { studentApplicationService } from "~/services/student-application.service";

import type { Application, CreateApplicationPayload } from "~/types/application";

export const useStudentApplicationStore = defineStore("student-application", () => {
	const application = ref<Application | null>(null);
	const isSubmitting = ref(false);
	const errorMessage = ref<string | null>(null);

	async function submitApplication(payload: CreateApplicationPayload): Promise<boolean> {
		isSubmitting.value = true;
		errorMessage.value = null;

		try {
			const response = await studentApplicationService.store(payload);

			application.value = response;

			return true;
		} catch (error: unknown) {
			const err = error as {
				data?: {
					message?: string;
					error?: string;
				};
				response?: {
					_data?: {
						message?: string;
						error?: string;
					};
				};
				message?: string;
			};

			errorMessage.value =
				err.data?.message ||
				err.data?.error ||
				err.response?._data?.message ||
				err.response?._data?.error ||
				err.message ||
				"Failed to submit application.";

			console.error("Failed to submit student application:", error);

			return false;
		} finally {
			isSubmitting.value = false;
		}
	}

	function reset() {
		application.value = null;
		isSubmitting.value = false;
		errorMessage.value = null;
	}

	return {
		application,
		isSubmitting,
		errorMessage,
		submitApplication,
		reset,
	};
});
