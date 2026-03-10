import { readMultipartFormData } from "h3";
import { parse } from "@fast-csv/parse";
import { normalizeRows } from "./normalize_helper";

export default defineEventHandler(async (event) => {
	const form = await readMultipartFormData(event);
	const file = form?.find((f) => f.name === "file");

	if (!file) throw createError({ statusCode: 400 });

	const csvString = file.data.toString();

	const rows: any[] = [];

	await new Promise<void>((resolve, reject) => {
		parse({ headers: true, ignoreEmpty: true })
			.on("error", reject)
			.on("data", (row) => rows.push(row))
			.on("end", () => resolve())
			.write(csvString)
			.end();
	});

	const normalized = normalizeRows(rows);

	const supabase = await serverSupabaseClient(event);

	await upsertBatch(supabase, normalized);

	return { success: true };
});
