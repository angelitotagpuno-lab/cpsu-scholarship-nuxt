export function useAuthApi() {
	const config = useRuntimeConfig();
	async function me() {
		const headers = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;

		return await $fetch("/api/v1/auth/me", { headers });
	}

	async function login(email: string, password: string) {
		return await $fetch(config.public.baseUrl + "/auth/login", {
			method: "POST",
			body: { email, password },
			credentials: "include",
		});
	}

	async function logout() {
		return await $fetch("/api/v1/auth/logout", {
			method: "POST",
		});
	}

	return { me, login, logout };
}
