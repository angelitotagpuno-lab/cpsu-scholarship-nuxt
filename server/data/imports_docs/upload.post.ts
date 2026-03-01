// import Papa from "papaparse";
import { readMultipartFormData } from "h3";
import { normalizeRows } from "./normalize_helper";

export default defineEventHandler(async (event) => {
	const form = await readMultipartFormData(event);
	const file = form?.find((f) => f.name === "file");

	if (!file) throw createError({ statusCode: 400 });

	const csvString = file.data.toString();

	const parsed = Papa.parse(csvString, {
		header: true,
		skipEmptyLines: true,
	});

	const rows = parsed.data as any[];

	const normalized = normalizeRows(rows);

	const supabase = await serverSupabaseClient(event);

	await upsertBatch(supabase, normalized);

	return { success: true };
});
