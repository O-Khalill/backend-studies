import bcrypt from "bcrypt";
import { UserModel } from "../../DB/models/user.model.js";
import { create, findOne, updateOne } from "../../DB/db.repo.js";
import {
  BadRequestException,
  conflictException,
  notFoundException,
} from "../../common/exceptions/app.exception.js";
import { compare, hash } from "../../common/security/hash.js";
import {
  decodeToken,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../common/utils/tokens.utils.js";

export async function signUp({
  firstName,
  lastName,
  email,
  password,
  gender,
  DOB,
}) {
  const exists = await findOne({ model: UserModel, filter: { email } });

  if (exists) {
    throw conflictException({ errmMsg: "User already exists" });
  }

  const hashedPassword = await hash(password);

  const user = await create({
    model: UserModel,
    data: { firstName, lastName, email, password: hashedPassword, gender, DOB },
  });

  return { id: user._id, email: user.email };
}

export async function login({ email, password }) {
  const user = await findOne({ model: UserModel, filter: { email } });

  if (!user) {
    throw BadRequestException({ errmMsg: "Invalid email or password" });
  }

  const correctPassword = await compare(password, user.password);

  if (!correctPassword) {
    throw BadRequestException({ errmMsg: "Invalid email or password" });
  }

  const accessToken = signAccessToken({ payload: email }, user._id);
  const refreshToken = signRefreshToken(user._id);
  const tokenExpirationDate = new Date(decodeToken(refreshToken).exp * 1000);

  const hashedRefreshToken = hashToken(refreshToken);

  const updated = await updateOne({
    model: UserModel,
    filter: { _id: user._id },
    updates: {
      $push: {
        refreshTokens: {
          $each: [
            { tokenHash: hashedRefreshToken, expiresAt: tokenExpirationDate },
          ],
        },
      },
    },
  });

  return { accessToken, refreshToken };
}
export async function refreshTokens({ refreshToken }) {
  if (!refreshToken) {
    throw BadRequestException({ errmMsg: "Refresh token is required" });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    // Reverted back to the secure standard error response
    throw BadRequestException({ errmMsg: "Invalid or expired refresh token" });
  }

  const incomingTokenHash = hashToken(refreshToken);

  const user = await findOne({
    model: UserModel,
    filter: {
      _id: decoded.sub,
      "refreshTokens.tokenHash": incomingTokenHash,
    },
  });

  if (!user) {
    throw BadRequestException({ errmMsg: "Invalid session or token revoked" });
  }

  const newAccessToken = signAccessToken({ email: user.email }, user._id);
  const newRefreshToken = signRefreshToken(user._id);
  const expiresAt = new Date(decodeToken(newRefreshToken).exp * 1000);
  const newHashedRefreshToken = hashToken(newRefreshToken);

  await updateOne({
    model: UserModel,
    filter: { _id: user._id },
    update: {
      $pull: { refreshTokens: { tokenHash: incomingTokenHash } },
    },
  });

  await updateOne({
    model: UserModel,
    filter: { _id: user._id },
    update: {
      $push: {
        refreshTokens: {
          tokenHash: newHashedRefreshToken,
          expiresAt: expiresAt,
        },
      },
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
