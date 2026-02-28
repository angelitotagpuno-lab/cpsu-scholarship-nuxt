import type { User } from "@supabase/supabase-js";
import { useAuthApi } from "~/composables/useAuthApi";

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
			const { user: loggedInUser } = await api.login(email, password);
			user.value = loggedInUser;
		} catch {
			errorMessage.value = "Invalid credentials";
			user.value = null;
			throw new Error("Auth failed");
		} finally {
			isLoading.value = false;
		}
	}

	async function logout() {
		await api.logout();
		user.value = null;
	}

	return { user, isLoading, errorMessage, isAuthenticated, fetchUser, login, logout };
});
