import type {
	Auth,
	AuthMeResponse,
	AuthResponse,
	StudentLogin,
	StudentRegister,
	StudentVerification,
} from "~/types/user";

const api = () => {
	const config = useRuntimeConfig();

	return {
		baseURL: config.public.baseUrl,
		credentials: "include" as const,
	};
};

function login(body: Auth): Promise<AuthResponse> {
	return $fetch("/api/v1/auth/login", {
		...api(),
		method: "POST",
		body,
	});
}

function studentLogin(body: StudentLogin): Promise<AuthResponse> {
	return $fetch("/api/v1/auth/student/login", {
		...api(),
		method: "POST",
		body,
	});
}

function verifyStudent(studentNumber: string): Promise<StudentVerification> {
	return $fetch("/api/v1/auth/student/verify", {
		...api(),
		method: "GET",
		query: { studentNumber },
	});
}

function registerStudent(body: StudentRegister): Promise<AuthResponse> {
	return $fetch("/api/v1/auth/student/register", {
		...api(),
		method: "POST",
		body,
	});
}

function logout(): Promise<unknown> {
	return $fetch("/api/v1/auth/logout", {
		...api(),
		method: "POST",
	});
}

function me(): Promise<AuthMeResponse> {
	return $fetch("/api/v1/auth/me", {
		...api(),
		method: "GET",
	});
}

export const authService = {
	login,
	studentLogin,
	verifyStudent,
	registerStudent,
	logout,
	me,
};
