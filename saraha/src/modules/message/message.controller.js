import { Router } from "express";
import {
	sendMessage,
	getInbox,
	requestIdentity,
	getRequests,
	respondToRequest,
	sendConversationMessage,
	getConversation,
} from "./message.service.js";

import { BadRequestException } from "../../common/exceptions/app.exception.js";
import { successResponse } from "../../common/responses/success.response.js";
import { validateData } from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
	sendMessageSchema,
	messageIdSchema,
	respondSchema,
	conversationMessageSchema,
} from "./message.validation.js";
import { rateLimit } from "../../middleware/ratelimit.middleware.js";

export const messageRouter = new Router();

const sendLimiter = rateLimit({
	name: "send-message",
	max: 30,
	windowSec: 15 * 60,
});

messageRouter.post(
	"/send",
	authenticate,
	sendLimiter,
	validateData(sendMessageSchema),
	async (req, res) => {
		const data = await sendMessage({ senderId: req.user.sub, ...req.body });
		successResponse({ res, status: 201, msg: "Message sent", data });
	},
);

messageRouter.get("/inbox", authenticate, async (req, res) => {
	const messages = await getInbox({ userId: req.user.sub });
	successResponse({ res, msg: "Inbox retrieved", data: messages });
});

messageRouter.post(
	"/request-identity",
	authenticate,
	validateData(messageIdSchema),
	async (req, res) => {
		await requestIdentity({
			userId: req.user.sub,
			messageId: req.body.messageId,
		});
		successResponse({ res, msg: "Identity request sent" });
	},
);

messageRouter.get("/requests", authenticate, async (req, res) => {
	const requests = await getRequests({ userId: req.user.sub });
	successResponse({ res, msg: "Requests retrieved", data: requests });
});

messageRouter.patch(
	"/respond",
	authenticate,
	validateData(respondSchema),
	async (req, res) => {
		const data = await respondToRequest({
			userId: req.user.sub,
			...req.body,
		});
		successResponse({ res, msg: `Request ${data.status}`, data });
	},
);

messageRouter.post(
	"/conversation/send",
	authenticate,
	sendLimiter,
	validateData(conversationMessageSchema),
	async (req, res) => {
		const data = await sendConversationMessage({
			userId: req.user.sub,
			rootId: req.body.messageId,
			content: req.body.content,
		});
		successResponse({ res, status: 201, msg: "Message sent", data });
	},
);

messageRouter.get(
	"/conversation/:messageId",
	authenticate,
	async (req, res) => {
		const parsed = messageIdSchema.safeParse({
			messageId: req.params.messageId,
		});
		if (!parsed.success) {
			throw BadRequestException({ errmMsg: "Invalid message id" });
		}

		const data = await getConversation({
			userId: req.user.sub,
			rootId: parsed.data.messageId,
		});
		successResponse({ res, msg: "Conversation retrieved", data });
	},
);
