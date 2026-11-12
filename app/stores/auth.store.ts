import { authService } from "~/services/auth.service";
import type {
	Auth,
	User,
	StudentLogin,
	StudentRegister,
	StudentVerification,
	AuthMeResponse,
} from "~/types/user";
import type { FetchError } from "ofetch";

export const useAuthStore = defineStore("auth", () => {
	const user = ref<User | null>(null);
	const currentAuth = ref<AuthMeResponse | null>(null);
	const isLoading = ref(false);
	const errorMessage = ref<string | null>(null);

	const isAuthenticated = computed(() => !!user.value);

	function getError(error: unknown, fallback: string) {
		const err = error as FetchError<{ message?: string; detail?: string }>;

		return err?.data?.message || err?.data?.detail || fallback;
	}

	async function getUser() {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			const res = await authService.me();

			currentAuth.value = res;
			user.value = res.user;
		} catch (error) {
			const err = error as FetchError;

			user.value = null;
			currentAuth.value = null;

			if (err?.response?.status !== 401) {
				errorMessage.value = getError(error, "Failed to fetch user");
			}
		} finally {
			isLoading.value = false;
		}
	}

	async function login(body: Auth) {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			const res = await authService.login(body);

			if (!["admin", "staff"].includes(res.user.role.toLowerCase())) {
				user.value = null;
				errorMessage.value = "Unauthorized. Administrator access only.";
				return false;
			}

			user.value = res.user;
			return true;
		} catch (error) {
			errorMessage.value = getError(error, "Login failed");
			return false;
		} finally {
			isLoading.value = false;
		}
	}

	async function loginStudent(body: StudentLogin) {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			const res = await authService.studentLogin(body);

			user.value = res.user;
			return true;
		} catch (error) {
			errorMessage.value = getError(error, "Student login failed");
			return false;
		} finally {
			isLoading.value = false;
		}
	}

	async function verifyStudent(studentNumber: string): Promise<StudentVerification | null> {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			return await authService.verifyStudent(studentNumber);
		} catch (error) {
			errorMessage.value = getError(error, "Student verification failed");
			return null;
		} finally {
			isLoading.value = false;
		}
	}

	async function registerStudent(body: StudentRegister) {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			await authService.registerStudent(body);
			return true;
		} catch (error) {
			errorMessage.value = getError(error, "Failed to register student");
			return false;
		} finally {
			isLoading.value = false;
		}
	}

	async function logout(redirectTo = "/user-login"): Promise<boolean> {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			await authService.logout();

			user.value = null;
			currentAuth.value = null;

			await navigateTo(redirectTo, {
				replace: true,
			});

			return true;
		} catch (error) {
			errorMessage.value = getError(error, "Failed to logout");
			return false;
		} finally {
			isLoading.value = false;
		}
	}

	return {
		user,
		currentAuth,
		isLoading,
		errorMessage,
		isAuthenticated,
		getUser,
		login,
		loginStudent,
		verifyStudent,
		registerStudent,
		logout,
	};
});
