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
			const { user: me } = await api.me();
			user.value = me;
		} catch {
			user.value = null;
		}
	}

	async function login(email: string, password: string) {
		isLoading.value = true;
		errorMessage.value = null;

		try {
			await api.login(email, password);

			const { user: me } = await api.me();
			user.value = me;

			return me;
		} catch {
			errorMessage.value = "Invalid credentials";
			user.value = null;
			throw new Error("Login failed");
		} finally {
			isLoading.value = false;
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
		logout,
	};
});
