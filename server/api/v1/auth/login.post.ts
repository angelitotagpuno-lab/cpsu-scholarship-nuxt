import { supabase } from "~~/server/utils/supabase";

export default defineEventHandler(async (event) => {
	const { email, password } = await readBody(event);

	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error || !data.session) {
		throw createError({
			statusCode: 401,
			statusMessage: "Invalid credentials",
		});
	}

	setCookie(event, "auth_token", data.session.access_token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
	});

	return { user: data.user };
});
