import mongoose from "mongoose";
import { GenderEnum } from "../../common/enums/user.enum.js";

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
    password: {
      type: String,
      minlength: 8,
      required: true,
    },
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.MALE,
    },
    DOB: {
      type: Date,
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
