const config = useRuntimeConfig();
const headers = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;

export function login(email: string, password: string) {
	return $fetch(config.public.baseUrl + "/api/auth/login", {
		method: "POST",
		body: { email, password },
		credentials: "include",
	});
}

export function logout() {
	return $fetch("/api/auth/logout", {
		method: "POST",
		credentials: "include",
	});
}

export function me() {
	return $fetch("/api/auth/me", {
		headers,
		credentials: "include",
	});
}
