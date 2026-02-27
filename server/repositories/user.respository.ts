import { supabase } from "../utils/supabase";

export class UserRepository {
	private table = "users";

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
}
