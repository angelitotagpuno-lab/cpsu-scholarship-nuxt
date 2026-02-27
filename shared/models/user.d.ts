import { z } from "zod";

export const UserSchema = z.object({
	name: z.string().min(1),
	status: z.enum(["active", "inactive"]),
});

export const updateUserSchema = UserSchema.partial();

export type UserInput = z.infer<typeof UserSchema>;
