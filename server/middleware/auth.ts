import { supabase } from "../utils/supabase";

export default defineEventHandler(async (event) => {
	const path = getRequestURL(event).pathname;

	if (!path.startsWith("/api/v1/users")) return;
	if (path.startsWith("/api/v1/auth/")) return;

	const cookieToken = getCookie(event, "auth_token");
	const bearerToken = getHeader(event, "authorization")?.replace("Bearer ", "");
	const token = cookieToken || bearerToken;

	if (!token) {
		throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
	}

	const { data, error } = await supabase.auth.getUser(token);
	if (error || !data.user) {
		throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
	}

	event.context.user = data.user;
});
