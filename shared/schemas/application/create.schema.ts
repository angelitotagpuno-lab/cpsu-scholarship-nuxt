import { z } from "zod";

export const CreateApplicationSchema = z.object({
	seq: z.number(),

	programName: z.string(),
	yearLevel: z.number().min(1).max(5),

	hasDisability: z.boolean(),
	hasIpGroup: z.boolean(),

	address: z.object({
		street: z.string(),
		barangay: z.string(),
		zipcode: z.string(),
	}),

	father: z.object({
		lastName: z.string(),
		givenName: z.string(),
		middleName: z.string().optional(),
	}),

	mother: z.object({
		lastName: z.string(),
		givenName: z.string(),
		middleName: z.string().optional(),
	}),
});
