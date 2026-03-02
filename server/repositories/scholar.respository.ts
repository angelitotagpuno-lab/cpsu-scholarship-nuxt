import { supabase } from "../utils/supabase";

export class ScholarRepository {
	private table = "scholars";
	private enrollmentTable = "enrollments";

	async create(data: any) {
		const { data: result, error } = await supabase.from(this.table).insert(data).select().single();

		if (error) throw createError({ statusCode: 400, statusMessage: error.message });
		return result;
	}

	async findById(id: string) {
		const { data, error } = await supabase.from(this.table).select("*").eq("id", id).single();

		if (error) throw createError({ statusCode: 404 });
		return data;
	}

	async findMany({ limit, offset, status }: { limit: number; offset: number; status?: string }) {
		let query = supabase.from(this.table).select("*", { count: "exact" });

		if (status) query = query.eq("status", status);

		const { data, count, error } = await query.range(offset, offset + limit - 1);

		if (error) throw createError({ statusCode: 400, statusMessage: error.message });

		return { data, count };
	}

	async upsertBatch(supabase: any, rows: any[]) {
		for (const row of rows) {
			const { data: scholar } = await supabase
				.from(this.table)
				.upsert(
					{
						scholar_identifier: row.scholar_identifier,
						last_name: row.last_name,
						first_name: row.first_name,
						middle_name: row.middle_name,
						ext_name: row.ext_name,
						sex: row.sex,
						contact: row.contact,
						email: row.email,
						street: row.street,
						city: row.city,
						province: row.province,
						zipcode: row.zipcode,
					},
					{ onConflict: "scholar_identifier" },
				)
				.select()
				.single();

			await supabase.from(this.enrollmentTable).upsert(
				{
					scholar_id: scholar.id,
					program_id: 1,
					course: row.course,
					year_level: row.year_level,
					batch: row.batch,
					award_no: row.award_no,
					app_no: row.app_no,
				},
				{ onConflict: "scholar_id,program_id,batch" },
			);
		}
	}
}
