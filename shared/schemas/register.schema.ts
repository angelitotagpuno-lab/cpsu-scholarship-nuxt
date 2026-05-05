import { z } from "zod";

export const RegisterSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),

	studentId: z.string().min(3),

	lastName: z.string(),
	givenName: z.string(),
	middleName: z.string().optional(),
	extName: z.string().optional(),

	sex: z.enum(["male", "female"]),
	birthdate: z.string(),

	contactNumber: z.string(),
});
