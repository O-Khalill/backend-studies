import mongoose from "mongoose";
import { GenderEnum, ProviderEnum } from "../../common/enums/user.enum.js";

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			minLength: 2,
			maxLength: 20,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			minLength: 2,
			maxLength: 20,
			required: true,
			trim: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		provider: {
			type: Number,
			enum: Object.values(ProviderEnum),
			default: ProviderEnum.SYSTEM,
		},
		password: {
			type: String,
			minlength: 8,
			required: function () {
				return this.provider === ProviderEnum.SYSTEM;
			},
		},
		gender: {
			type: Number,
			enum: Object.values(GenderEnum),
			default: GenderEnum.MALE,
		},
		DOB: {
			type: Date,
		},
		phoneNumber: {
			type: String,
			trim: true,
			unique: true,
			sparse: true,
			required: function () {
				return this.provider === ProviderEnum.SYSTEM;
			},
		},
		confirmEmail: {
			type: Boolean,
			default: false,
		},
		changeCredentialsTime: Date,
		refreshTokens: {
			type: [
				{
					tokenHash: { type: String, required: true },
					expiresAt: { type: Date, required: true },
				},
			],
			select: false,
		},
		profilePicPath: String,
		coverPicPath: String,
		DeletedAt: Date,
	},
	{
		timestamps: true,
		optimisticConcurrency: true,
	},
);

export const UserModel = mongoose.model("User", userSchema);
