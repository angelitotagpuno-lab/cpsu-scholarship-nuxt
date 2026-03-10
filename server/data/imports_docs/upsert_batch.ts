async function upsertBatch(supabase: any, rows: any[]) {
	for (const row of rows) {
		// 1️⃣ Upsert student
		const { data: student } = await supabase
			.from("scholars")
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

		// 2️⃣ Upsert enrollment
		await supabase.from("enrollments").upsert(
			{
				scholar_id: student.id,
				program_id: 1, // determine from file
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
