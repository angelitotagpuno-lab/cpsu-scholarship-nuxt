import { supabase } from "~~/server/utils/supabase";

export default defineEventHandler(async (event) => {
	const token = getCookie(event, "auth_token");

	if (!token) return;

	const { data, error } = await supabase.auth.getUser(token);

	if (error || !data.user) return;

	event.context.user = data.user;
});
