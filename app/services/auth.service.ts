import type { ApiResponse } from "~/types/api-response";
import type { Auth, User } from "~/types/user";

function login(body: Auth): Promise<ApiResponse<User>> {
	return $fetch("/proxy/api/auth/login", { method: "POST", body, credentials: "include" });
}

function logout() {
	return $fetch("/proxy/api/auth/logout", { method: "GET", credentials: "include" });
}

function me(): Promise<ApiResponse<User>> {
	return $fetch("/proxy/api/auth/me", { method: "GET", credentials: "include" });
}

function register(body: Auth): Promise<ApiResponse<User>> {
	return $fetch("/proxy/api/auth/register", { method: "POST", body });
}

export const authService = {
	login,
	logout,
	me,
	register,
};
