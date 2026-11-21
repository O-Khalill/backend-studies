import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const sendMessageSchema = z.object({
	receiverId: objectId,
	content: z.string().trim().min(1).max(1000),
});

export const messageIdSchema = z.object({
	messageId: objectId,
});

export const respondSchema = z.object({
	messageId: objectId,
	decision: z.enum(["accept", "reject"]),
});

export const conversationMessageSchema = z.object({
	messageId: objectId,
	content: z.string().trim().min(1).max(1000),
});
