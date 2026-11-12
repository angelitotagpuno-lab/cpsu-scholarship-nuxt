import { z } from "zod";

export const ListApplicationQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(50).default(10),

	status: z.string().optional(),
	programName: z.string().optional(),
	yearLevel: z.coerce.number().optional(),
});
