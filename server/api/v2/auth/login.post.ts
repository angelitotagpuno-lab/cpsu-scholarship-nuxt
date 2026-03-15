import { supabase } from "~~/server/utils/supabase";
import { LoginSchema } from "~~/shared/schemas/auth";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const parsed = LoginSchema.safeParse(body);

	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			statusMessage: parsed.error.issues[0]?.message,
		});
	}

	const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

	if (error || !data.session) {
		throw createError({ statusCode: 401, statusMessage: "Invalid credentials" });
	}

	setCookie(event, "auth_token", data.session.access_token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
	});

	return {
		user: data.user,
		role: data.user.user_metadata?.role,
	};
});
