import { ScholarRepository } from "~~/server/data/repositories/scholar.repository";

export default defineEventHandler(async (_) => {
	const repository = new ScholarRepository();

	await repository.findFirst();

	return { ok: true, timestamp: new Date().toISOString() };
});
