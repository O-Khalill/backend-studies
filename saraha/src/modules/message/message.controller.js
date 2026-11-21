import { Router } from "express";
import {
	sendMessage,
	getInbox,
	requestIdentity,
	getRequests,
} from "./message.service.js";
import { successResponse } from "../../common/responses/success.response.js";
import { validateData } from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { sendMessageSchema, messageIdSchema } from "./message.validation.js";
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
