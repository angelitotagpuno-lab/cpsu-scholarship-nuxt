import { useRuntimeConfig, useRequestHeaders } from "#imports";

export function useAuthApi() {
	const config = useRuntimeConfig();
	const baseUrl = config.public.baseUrl;

	const headers = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;

	function login(email: string, password: string) {
		return $fetch(baseUrl + "/api/auth/login", {
			method: "POST",
			body: { email, password },
			credentials: "include",
		});
	}

	function logout() {
		return $fetch(baseUrl + "/api/auth/logout", {
			method: "POST",
			credentials: "include",
		});
	}

	function me() {
		return $fetch(baseUrl + "/api/auth/me", {
			headers,
			credentials: "include",
		});
	}

	function register(email: string, password: string) {
		return $fetch(baseUrl + "/api/auth/register", {
			method: "POST",
			body: { email, password },
		});
	}

	return {
		login,
		logout,
		me,
		register,
	};
}
