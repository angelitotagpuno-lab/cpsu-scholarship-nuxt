import { supabase } from "~~/server/utils/supabase";
import { ListApplicationQuerySchema } from "~~/shared/schemas/application/list.schema";
import { ApplicationRepository } from "~~/server/repositories/application.repository";

export default defineEventHandler(async (event) => {
	const user = event.context.user;

	if (!user) {
		throw createError({ statusCode: 401 });
	}

	const query = getQuery(event);

	const parsed = ListApplicationQuerySchema.safeParse(query);

	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			statusMessage: parsed.error.issues[0]?.message,
		});
	}

	const role = user.user_metadata?.role;

	const repo = new ApplicationRepository(supabase);

	const result = await repo.list(parsed.data, role, user.id);

	return {
		success: true,
		page: parsed.data.page,
		limit: parsed.data.limit,
		total: result.count,
		data: result.data,
	};
});
