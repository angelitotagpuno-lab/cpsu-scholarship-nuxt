import type { User } from "@supabase/supabase-js";
import useAuth from "~/composables/useAuth";

export const useAuthStore = defineStore("auth-store", () => {
	const user = ref<User | null>(null);
	const isLoading = ref(false);
	const errorMessage = ref("");
	const isError = ref(false);
	const isAuthenticated = computed(() => !!user.value);

	const { fetchUser, login } = useAuth();

	async function getUser() {
		isLoading.value = true;
		isError.value = false;
		errorMessage.value = "";
		try {
			user.value = await fetchUser();
		} catch {
			user.value = null;
			errorMessage.value = "Unauthorized";
		} finally {
			isLoading.value = false;
		}
	}

	async function signin(email: string, password: string) {
		isLoading.value = true;
		isError.value = false;
		errorMessage.value = "";
		try {
			user.value = await login(email, password);
		} catch {
			user.value = null;
			isError.value = true;
			errorMessage.value = "Invalid Credentials";
		} finally {
			isLoading.value = false;
		}
	}

	async function signout() {
		try {
			await $fetch("/api/v1/auth/logout", { method: "POST" });
		} finally {
			user.value = null;
		}
	}

	return {
		user,
		isLoading,
		getUser,
		errorMessage,
		signin,
		signout,
		isError,
		isAuthenticated,
	};
});
