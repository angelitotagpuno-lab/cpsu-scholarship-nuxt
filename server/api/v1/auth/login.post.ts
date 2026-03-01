import { supabase } from "~~/server/utils/supabase";
import { LoginSchema } from "~~/shared/schemas/auth";

export default defineEventHandler(async (event) => {
	const payload = await readBody(event);
	const parsed = LoginSchema.safeParse(payload);

	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			statusMessage: parsed.error.issues[0]?.message || "Invalid request payload",
		});
	}

	const { email, password } = parsed.data;

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
	console.log("here" + data + " " + error);

	setCookie(event, "auth_token", data.session.access_token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
	});

	return { user: data.user };
});
