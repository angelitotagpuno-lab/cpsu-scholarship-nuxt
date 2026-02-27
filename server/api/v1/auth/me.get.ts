import { supabase } from "~~/server/utils/supabase";

export default defineEventHandler(async (event) => {
	const token = getCookie(event, "auth_token");

	if (!token) {
		throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
	}

	const { data, error } = await supabase.auth.getUser(token);

	if (error || !data.user) {
		throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
	}

	return { user: data.user };
});
