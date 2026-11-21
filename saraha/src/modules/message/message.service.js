import { MessageModel } from "../../DB/models/message.model.js";
import { UserModel } from "../../DB/models/user.model.js";
import { IdentityStatusEnum } from "../../common/enums/message.enum.js";
import {
	create,
	find,
	findById,
	findOne,
	findOneAndUpdate,
} from "../../DB/db.repo.js";
import {
	BadRequestException,
	conflictException,
	notFoundException,
} from "../../common/exceptions/app.exception.js";
export async function sendMessage({
	senderId,
	receiverId,
	content,
	attachments = [],
}) {
	if (!content && attachments.length === 0) {
		throw BadRequestException({
			errmMsg: "A message needs text or at least one attachment",
		});
	}
	if (String(senderId) === receiverId) {
		throw BadRequestException({ errmMsg: "You cannot message yourself" });
	}

	const receiver = await findById({
		model: UserModel,
		id: receiverId,
		select: "_id DeletedAt",
	});
	if (!receiver || receiver.DeletedAt) {
		throw notFoundException({ errmMsg: "User not found" });
	}

	const message = await create({
		model: MessageModel,
		data: { sender: senderId, receiver: receiverId, content, attachments },
	});

	return { id: message._id };
}

export async function getInbox({ userId }) {
	return find({
		model: MessageModel,
		filter: { receiver: userId, parent: null },
		select: "content attachments identityStatus createdAt",
		options: { sort: { createdAt: -1 }, limit: 50 },
	});
}
export async function requestIdentity({ userId, messageId }) {
	const message = await findOne({
		model: MessageModel,
		filter: { _id: messageId, receiver: userId, parent: null },
		select: "identityStatus",
	});
	if (!message) throw notFoundException({ errmMsg: "Message not found" });

	if (message.identityStatus !== IdentityStatusEnum.NONE) {
		throw conflictException({
			errmMsg: "Identity was already requested for this message",
		});
	}

	const updated = await findOneAndUpdate({
		model: MessageModel,
		filter: {
			_id: messageId,
			receiver: userId,
			parent: null,
			identityStatus: IdentityStatusEnum.NONE,
		},
		updates: { identityStatus: IdentityStatusEnum.PENDING },
	});
	if (!updated) {
		throw conflictException({
			errmMsg: "Identity was already requested for this message",
		});
	}
}

export async function getRequests({ userId }) {
	return find({
		model: MessageModel,
		filter: {
			sender: userId,
			parent: null,
			identityStatus: { $ne: IdentityStatusEnum.NONE },
		},
		select: "content identityStatus createdAt updatedAt",
		options: { sort: { updatedAt: -1 }, limit: 50 },
	});
}

export async function respondToRequest({ userId, messageId, decision }) {
	// Only the original sender can decide
	const message = await findOne({
		model: MessageModel,
		filter: { _id: messageId, sender: userId, parent: null },
		select: "identityStatus",
	});
	if (!message) throw notFoundException({ errmMsg: "Message not found" });

	if (message.identityStatus !== IdentityStatusEnum.PENDING) {
		throw conflictException({
			errmMsg: "There is no pending identity request for this message",
		});
	}

	const newStatus =
		decision === "accept"
			? IdentityStatusEnum.ACCEPTED
			: IdentityStatusEnum.REJECTED;

	const updated = await findOneAndUpdate({
		model: MessageModel,
		filter: {
			_id: messageId,
			sender: userId,
			parent: null,
			identityStatus: IdentityStatusEnum.PENDING,
		},
		updates: { identityStatus: newStatus },
	});
	if (!updated) {
		throw conflictException({
			errmMsg: "There is no pending identity request for this message",
		});
	}

	return { status: newStatus };
}

async function getConversationRoot({ userId, rootId }) {
	const root = await findOne({
		model: MessageModel,
		filter: {
			_id: rootId,
			parent: null,
			$or: [{ sender: userId }, { receiver: userId }],
		},
		select: "+sender",
	});

	if (!root || root.identityStatus !== IdentityStatusEnum.ACCEPTED) {
		throw notFoundException({ errmMsg: "Conversation not found" });
	}
	return root;
}

export async function sendConversationMessage({
	userId,
	rootId,
	content,
	attachments = [],
}) {
	if (!content && attachments.length === 0) {
		throw BadRequestException({
			errmMsg: "A message needs text or at least one attachment",
		});
	}

	const root = await getConversationRoot({ userId, rootId });

	const receiver =
		String(root.sender) === String(userId) ? root.receiver : root.sender;

	const message = await create({
		model: MessageModel,
		data: {
			sender: userId,
			receiver,
			content,
			attachments,
			parent: root._id,
		},
	});
	return { id: message._id };
}
export async function getConversation({ userId, rootId }) {
	const root = await getConversationRoot({ userId, rootId });

	const replies = await find({
		model: MessageModel,
		filter: { parent: root._id },
		select: "+sender content attachments createdAt",
		options: { sort: { createdAt: 1 }, limit: 200 },
	});

	const users = await find({
		model: UserModel,
		filter: { _id: { $in: [root.sender, root.receiver] } },
		select: "firstName lastName",
	});
	const nameOf = new Map(
		users.map((u) => [
			String(u._id),
			{ id: u._id, firstName: u.firstName, lastName: u.lastName },
		]),
	);

	const messages = [root, ...replies].map((m) => ({
		id: m._id,
		content: m.content,
		attachments: m.attachments,
		createdAt: m.createdAt,
		author: nameOf.get(String(m.sender)),
		mine: String(m.sender) === String(userId),
	}));

	return { conversationId: root._id, messages };
}
