import type { SupabaseClient } from "@supabase/supabase-js";

export class StudentRepository {
	constructor(private db: SupabaseClient) {}

	async create(payload: any) {
		return await this.db.from("students").insert(payload).select().single();
	}

	async findByStudentId(studentId: string) {
		return await this.db.from("students").select("id").eq("student_id", studentId).maybeSingle();
	}
}
