import { supabase } from "~~/server/utils/supabase";
import { requireRole } from "~~/server/utils/require-role";
import { ApplicationRepository } from "~~/server/repositories/application.repository";
import { CreateApplicationSchema } from "~~/shared/schemas/application/create.schema";

export default defineEventHandler(async (event) => {
	const user = requireRole(event, "student");

	const body = await readBody(event);

	const parsed = CreateApplicationSchema.safeParse(body);

	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			statusMessage: parsed.error.issues[0]?.message,
		});
	}

	const repo = new ApplicationRepository(supabase);

	const application = await repo.createAggregate(user.id, parsed.data);

	return {
		success: true,
		data: application,
	};
});
