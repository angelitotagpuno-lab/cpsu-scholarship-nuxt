export function useAuthApi() {
	async function me() {
		const headers = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;

		return await $fetch("/api/v1/auth/me", { headers });
	}

	async function login(email: string, password: string) {
		return await $fetch("/api/v1/auth/login", {
			method: "POST",
			body: { email, password },
		});
	}

	async function logout() {
		return await $fetch("/api/v1/auth/logout", {
			method: "POST",
		});
	}

	return { me, login, logout };
}
