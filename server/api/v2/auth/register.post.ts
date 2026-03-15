import { StudentRepository } from "~~/server/repositories/student.repository";
import { supabase } from "~~/server/utils/supabase";
import { RegisterSchema } from "~~/shared/schemas/register.schema";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	const parsed = RegisterSchema.safeParse(body);

	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			statusMessage: parsed.error.issues[0]?.message,
		});
	}

	const repo = new StudentRepository(supabase);

	// prevent duplicate domain identity
	const existing = await repo.findByStudentId(parsed.data.studentId);

	if (existing.data) {
		throw createError({
			statusCode: 409,
			statusMessage: "Student already registered",
		});
	}

	// create auth user
	const { data, error } = await supabase.auth.signUp({
		email: parsed.data.email,
		password: parsed.data.password,
		options: {
			data: {
				role: "student",
			},
		},
	});

	if (error || !data.user) {
		throw createError({
			statusCode: 400,
			statusMessage: error?.message || "Signup failed",
		});
	}

	// insert domain student row
	const { error: insertError } = await repo.create({
		id: data.user.id,
		student_id: parsed.data.studentId,

		last_name: parsed.data.lastName,
		given_name: parsed.data.givenName,
		middle_name: parsed.data.middleName,
		ext_name: parsed.data.extName,

		sex: parsed.data.sex,
		birthdate: parsed.data.birthdate,

		contact_number: parsed.data.contactNumber,
		email: parsed.data.email,
	});

	if (insertError) {
		throw createError({
			statusCode: 500,
			statusMessage: insertError.message,
		});
	}

	return {
		success: true,
		userId: data.user.id,
	};
});
