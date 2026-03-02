import { ScholarRepository } from "~~/server/repositories/scholar.respository";

export default defineEventHandler(async (_) => {
	const repository = new ScholarRepository();

	await repository.findFirst();

	return { ok: true, timestamp: new Date().toISOString() };
});
