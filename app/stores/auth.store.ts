import { useAuthApi } from "~/composables/useAuthApi";

type User = {
	id: number;
	email: string;
	role: "admin" | "user";
};

export const useAuthStore = defineStore("auth", () => {
	const user = ref<User | null>(null);
	const isLoading = ref(false);
	const errorMessage = ref<string | null>(null);

	const isAuthenticated = computed(() => !!user.value);

	const api = useAuthApi();

	async function fetchUser() {
		try {
			const res = await api.me();
			user.value = res.user ?? res;
		} catch {
			user.value = null;
		}
	}

	async function login(email: string, password: string) {
		isLoading.value = true;
		errorMessage.value = null;

		try {
			await api.login(email, password);

			const res = await api.me();
			user.value = res.user ?? res;

			return user.value;
		} catch (e) {
			errorMessage.value = "Invalid credentials";
			user.value = null;
			throw e;
		} finally {
			isLoading.value = false;
		}
	}

	// ✅ FIXED registerUser
	async function registerUser(payload: Parameters<typeof api.register>[0]) {
		try {
			await api.register(payload.email, payload.password);
		} catch (e) {
			console.error("Registration failed:", e);
			throw e;
		}
	}

	async function logout() {
		await api.logout();
		user.value = null;
	}

	return {
		user,
		isLoading,
		errorMessage,
		isAuthenticated,
		fetchUser,
		login,
		registerUser,
		logout,
	};
});
