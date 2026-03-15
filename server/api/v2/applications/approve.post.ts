import { supabase } from "~~/server/utils/supabase";
import { requireRole } from "~~/server/utils/require-role";
import { z } from "zod";
import { ApplicationRepository } from "~~/server/repositories/application.repository";

const Schema = z.object({
	applicationId: z.string().uuid(),
	programId: z.number(),
});

export default defineEventHandler(async (event) => {
	requireRole(event, "admin");

	const body = await readBody(event);

	const parsed = Schema.safeParse(body);

	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			statusMessage: parsed.error.issues[0]?.message,
		});
	}

	const repo = new ApplicationRepository(supabase);

	await repo.approve(parsed.data.applicationId, parsed.data.programId);

	return {
		success: true,
	};
});
