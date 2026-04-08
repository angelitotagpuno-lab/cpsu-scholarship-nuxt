import { authService } from "~/services/auth.service";
import type { Auth, User } from "~/types/user";

export const useAuthStore = defineStore("auth", () => {
	const user = ref<User | null>(null);
	const isLoading = ref(false);
	const errorMessage = ref<string | null>(null);

	const isAuthenticated = computed(() => !!user.value);

	async function getUser() {
		errorMessage.value = null;
		isLoading.value = true;
		try {
			const res = await authService.me();
			console.log("here" + res.data.role);
			user.value = res.data;
		} catch (e) {
			errorMessage.value = "Failed to fetch user";
			console.error("here err" + e);
		} finally {
			isLoading.value = false;
		}
	}

	async function login(body: Auth) {
		errorMessage.value = null;
		isLoading.value = true;
		try {
			const res = await authService.login(body);
			user.value = res.data;
		} catch (e) {
			errorMessage.value = "Invalid credentials";
			console.log("here err" + e);
		} finally {
			isLoading.value = false;
		}
	}

	async function register(body: Auth) {
		errorMessage.value = null;
		isLoading.value = true;
		try {
			await authService.register(body);
		} catch (e) {
			errorMessage.value = "Failed to register user";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	async function logout() {
		errorMessage.value = null;
		isLoading.value = true;
		try {
			await authService.logout();
			user.value = null;
		} catch (e) {
			errorMessage.value = "Failed to logout";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	}

	return {
		user,
		isLoading,
		errorMessage,
		isAuthenticated,
		getUser,
		login,
		register,
		logout,
	};
});
