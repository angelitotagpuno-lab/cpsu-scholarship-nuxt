import type { SupabaseClient } from "@supabase/supabase-js";

export class ApplicationRepository {
	constructor(private db: SupabaseClient) {}

	async createAggregate(studentId: string, payload: any) {
		const { data: application, error } = await this.db
			.from("applications")
			.insert({
				student_id: studentId,
				seq: payload.seq,
				program_name: payload.programName,
				year_level: payload.yearLevel,
				has_disability: payload.hasDisability,
				has_ip_group: payload.hasIpGroup,
			})
			.select()
			.single();

		if (error) throw error;

		await this.db.from("application_parents").insert([
			{
				application_id: application.id,
				type: "father",
				last_name: payload.father.lastName,
				given_name: payload.father.givenName,
				middle_name: payload.father.middleName,
			},
			{
				application_id: application.id,
				type: "mother",
				last_name: payload.mother.lastName,
				given_name: payload.mother.givenName,
				middle_name: payload.mother.middleName,
			},
		]);

		await this.db.from("application_addresses").insert({
			application_id: application.id,
			street: payload.address.street,
			barangay: payload.address.barangay,
			zipcode: payload.address.zipcode,
		});

		return application;
	}

	async list(filters: any, role: string, userId: string) {
		let query = this.db
			.from("applications")
			.select("*", { count: "exact" })
			.order("created_at", { ascending: false });

		if (role === "student") {
			query = query.eq("student_id", userId);
		}

		if (filters.status) {
			query = query.eq("status", filters.status);
		}

		if (filters.programName) {
			query = query.eq("program_name", filters.programName);
		}

		if (filters.yearLevel) {
			query = query.eq("year_level", filters.yearLevel);
		}

		const from = (filters.page - 1) * filters.limit;
		const to = from + filters.limit - 1;

		query = query.range(from, to);

		const { data, error, count } = await query;

		if (error) throw error;

		return {
			data,
			count,
		};
	}

	async approve(applicationId: string, programId: number) {
		const { error } = await this.db.rpc("approve_application_tx", {
			p_application_id: applicationId,
			p_program_id: programId,
		});

		if (error) throw error;

		return true;
	}
}
