import { supabase } from "../utils/supabase";

export default defineEventHandler(async (event) => {
	const token = getHeader(event, "authorization")?.replace("Bearer ", "");
	if (!token) throw createError({ statusCode: 401 });

	const { data, error } = await supabase.auth.getUser(token);
	if (error || !data.user) throw createError({ statusCode: 401 });

	event.context.user = data.user;
});
