import type { H3Event } from "h3";

export function requireRole(event: H3Event, role: "admin" | "student") {
	const user = event.context.user;

	if (!user) {
		throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
	}

	const userRole = user.user_metadata?.role;

	if (userRole !== role) {
		throw createError({ statusCode: 403, statusMessage: "Forbidden" });
	}

	return user;
}
