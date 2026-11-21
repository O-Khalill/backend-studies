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
export async function sendMessage({ senderId, receiverId, content }) {
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
		data: { sender: senderId, receiver: receiverId, content },
	});

	return { id: message._id };
}

export async function getInbox({ userId }) {
	return find({
		model: MessageModel,
		filter: { receiver: userId, parent: null },
		select: "content identityStatus createdAt",
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
