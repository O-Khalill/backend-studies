import { z } from "zod";

export const sendMessageSchema = z.object({
	receiverId: z
		.string()
		.regex(/^[0-9a-fA-F]{24}$/, "Invalid user id")
		.toLowerCase(),
	content: z.string().trim().min(1).max(1000),
});
