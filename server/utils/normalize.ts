export function normalizeRows(rows: any[]) {
	return rows.map((row) => {
		const normalized = {
			student_identifier: row["STUDENT ID"] || row["App No."] || row["APP ID"],

			last_name: row["LAST NAME"] || row["LastName"],

			first_name: row["FIRST NAME"] || row["FirstName"],

			middle_name: row["MIDDLE NAME"] || row["MiddleName"],

			ext_name: row["EXT. NAME"] || row["Ext"],

			sex: normalizeSex(row["SEX"] || row["Sex"]),

			contact: row["CONTACT NO."] || row["Contact"],

			email: row["EMAIL ADD."],

			street: row["Street"],
			city: row["CITY"] || row["Town/City"],
			province: row["PROVINCE"],
			zipcode: row["ZIPCODE"],

			course: row["COURSE/PROGRAM ENROLLED"] || row["Course"],

			year_level: parseInt(row["YEAR LEVEL"] || row["Yr"]),

			batch: row["BATCH"],

			award_no: row["AWARD NO"],
			app_no: row["App No."] || row["APP ID"],
		};

		return normalized;
	});
}

function normalizeSex(value?: string) {
	if (!value) return null;
	if (value.toLowerCase().startsWith("m")) return "Male";
	if (value.toLowerCase().startsWith("f")) return "Female";
	return null;
}
