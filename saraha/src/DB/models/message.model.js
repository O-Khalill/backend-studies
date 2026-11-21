import mongoose from "mongoose";
import { IdentityStatusEnum } from "../../common/enums/message.enum.js";

const messageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			select: false,
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			required: true,
			trim: true,
			minLength: 1,
			maxLength: 1000,
		},

		attachments: {
			type: [String],
			default: [],
		},

		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
			default: null,
		},

		identityStatus: {
			type: String,
			enum: Object.values(IdentityStatusEnum),
			default: IdentityStatusEnum.NONE,
		},
	},
	{ timestamps: true },
);

messageSchema.index({ parent: 1, createdAt: 1 });

messageSchema.index({ receiver: 1, createdAt: -1 });

messageSchema.index({ sender: 1, identityStatus: 1 });

export const MessageModel = mongoose.model("Message", messageSchema);
