import type { User } from "@supabase/supabase-js";
import useAuth from "~/composables/useAuth";

export const useAuthStore = defineStore("auth-store", () => {
	const user = ref<User | null>(null);
	const isLoading = ref(false);
	const error = ref<string | null>(null);
	const isAuthenticated = computed(() => !!user.value);

	const { fetchUser, login } = useAuth();

	async function getUser() {
		isLoading.value = true;
		error.value = null;
		try {
			user.value = await fetchUser();
		} catch {
			user.value = null;
			error.value = "Unauthorized";
		} finally {
			isLoading.value = false;
		}
	}

	async function signin(email: string, password: string) {
		isLoading.value = true;
		error.value = null;
		try {
			user.value = await login(email, password);
		} catch {
			user.value = null;
			error.value = "Invalid admin credentials";
		} finally {
			isLoading.value = false;
		}
	}

	async function signout() {
		try {
			await $fetch("/api/v1/auth/logout", { method: "POST" });
		} finally {
			user.value = null;
			error.value = null;
		}
	}

	return {
		user,
		isLoading,
		getUser,
		error,
		signin,
		signout,
		isAuthenticated,
	};
});
