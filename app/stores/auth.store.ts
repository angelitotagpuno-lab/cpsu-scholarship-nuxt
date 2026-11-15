import { defineStore } from "pinia";
import { ref, computed } from "vue";
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

const ADMIN_ROLES = ["admin", "personnel", "staff"];

export const useAuthStore = defineStore("auth", () => {
	const user = ref<User | null>(null);
	const currentAuth = ref<AuthMeResponse | null>(null);
	const isLoading = ref(false);
	const errorMessage = ref<string | null>(null);

	const isAuthenticated = computed(() => !!user.value);

	const isAdmin = computed(() => ADMIN_ROLES.includes(user.value?.role?.toLowerCase() || ""));

	const isStudent = computed(() => user.value?.role?.toLowerCase() === "student");

	function clearAuth() {
		user.value = null;
		currentAuth.value = null;
	}

	function getError(error: unknown, fallback: string): string {
		const err = error as FetchError<{
			message?: string;
			detail?: string;
		}>;

		const detail = err?.data?.detail;

		return err?.data?.message || (typeof detail === "string" ? detail : null) || fallback;
	}

	async function getUser(): Promise<boolean> {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			const res = await authService.me();

			if (!res?.user) {
				clearAuth();
				return false;
			}

			user.value = res.user;
			currentAuth.value = res;

			return true;
		} catch (error) {
			clearAuth();

			const err = error as FetchError;

			if (err?.response?.status !== 401) {
				errorMessage.value = getError(error, "Failed to fetch user.");

				console.error("Get user error:", error);
			}

			return false;
		} finally {
			isLoading.value = false;
		}
	}

	async function login(body: Auth): Promise<boolean> {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			const res = await authService.login({
				email: body.email.trim(),
				password: body.password,
			});

			if (!res?.user) {
				clearAuth();
				errorMessage.value = "Invalid login response.";
				return false;
			}

			const role = res.user.role?.toLowerCase() || "";

			if (!ADMIN_ROLES.includes(role)) {
				clearAuth();

				errorMessage.value = "This account does not have admin or personnel access.";

				return false;
			}

			user.value = res.user;

			currentAuth.value = {
				user: res.user,
			};

			return true;
		} catch (error) {
			clearAuth();

			const err = error as FetchError;
			const status = err?.response?.status;

			if (status === 401) {
				errorMessage.value = "Invalid email or password.";
			} else if (status === 422) {
				errorMessage.value = "Invalid login information.";
			} else {
				errorMessage.value = getError(error, "Login failed. Please try again.");
			}

			console.error("Admin/personnel login error:", error);

			return false;
		} finally {
			isLoading.value = false;
		}
	}

	async function loginStudent(body: StudentLogin): Promise<boolean> {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			const res = await authService.studentLogin({
				studentNumber: body.studentNumber.trim(),
				password: body.password,
			});

			if (!res?.user) {
				clearAuth();
				errorMessage.value = "Invalid student login response.";
				return false;
			}

			const role = res.user.role?.toLowerCase() || "";

			if (role !== "student") {
				clearAuth();

				errorMessage.value = "This account is not a student account.";

				return false;
			}

			user.value = res.user;

			currentAuth.value = {
				user: res.user,
				...(res.student ? { student: res.student } : {}),
			};

			return true;
		} catch (error) {
			clearAuth();

			const err = error as FetchError;
			const status = err?.response?.status;

			if (status === 401) {
				errorMessage.value = "Invalid student number or password.";
			} else if (status === 422) {
				errorMessage.value = "Invalid student login information.";
			} else {
				errorMessage.value = getError(error, "Student login failed.");
			}

			console.error("Student login error:", error);

			return false;
		} finally {
			isLoading.value = false;
		}
	}

	async function verifyStudent(studentNumber: string): Promise<StudentVerification | null> {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			const res = await authService.verifyStudent(studentNumber.trim());

			return res;
		} catch (error) {
			errorMessage.value = getError(error, "Student verification failed.");

			console.error("Student verification error:", error);

			return null;
		} finally {
			isLoading.value = false;
		}
	}

	async function registerStudent(body: StudentRegister): Promise<boolean> {
		errorMessage.value = null;
		isLoading.value = true;

		try {
			await authService.registerStudent({
				studentNumber: body.studentNumber.trim(),
				email: body.email.trim(),
				password: body.password,
			});

			return true;
		} catch (error) {
			const err = error as FetchError;
			const status = err?.response?.status;

			if (status === 409) {
				errorMessage.value = "Student already registered or email already exists.";
			} else if (status === 422) {
				errorMessage.value = "Invalid registration information.";
			} else {
				errorMessage.value = getError(error, "Failed to register student.");
			}

			console.error("Student registration error:", error);

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
		} catch (error) {
			const err = error as FetchError;

			if (err?.response?.status !== 401) {
				errorMessage.value = getError(error, "Failed to logout.");

				console.error("Logout error:", error);

				isLoading.value = false;
				return false;
			}
		}

		try {
			clearAuth();

			await navigateTo(redirectTo, {
				replace: true,
			});

			return true;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			errorMessage.value = "Logged out locally, but navigation failed.";

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
		isAdmin,
		isStudent,
		getUser,
		login,
		loginStudent,
		verifyStudent,
		registerStudent,
		logout,
	};
});
