import type { User } from "@supabase/supabase-js";

type MeResponse = {
	user: User;
};

type LoginResponse = {
	user: User;
};

export default function useAuth() {
	const user = useState<User | null>("auth-user", () => null);

	async function fetchUser(): Promise<User | null> {
		if (user.value) return user.value;

		try {
			const headers = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;
			const response = await $fetch<MeResponse>("/api/v1/auth/me", { headers });
			user.value = response.user;
			return user.value;
		} catch (error) {
			user.value = null;
			throw error;
		}
	}

	async function login(email: string, password: string): Promise<User> {
		const response = await $fetch<LoginResponse>("/api/v1/auth/login", {
			method: "POST",
			body: { email, password },
		});

		user.value = response.user;
		return response.user;
	}

	return { user, fetchUser, login };
}
