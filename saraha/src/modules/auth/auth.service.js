import bcrypt from "bcrypt";
import { UserModel } from "../../DB/models/user.model.js";
import { ProviderEnum } from "../../common/enums/user.enum.js";
import { verifyGoogleToken } from "../../common/utils/google.utils.js";
import { create, findOne, updateOne } from "../../DB/db.repo.js";
import {
	BadRequestException,
	conflictException,
	notFoundException,
} from "../../common/exceptions/app.exception.js";
import { compare, hash, hashPhone } from "../../common/security/hash.js";
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
	phoneNumber,
	gender,
	DOB,
}) {
	const phoneHash = hashPhone(phoneNumber);

	const exists = await findOne({
		model: UserModel,
		filter: { $or: [{ email }, { phoneNumber: phoneHash }] },
	});

	if (exists) {
		throw conflictException({ errmMsg: "User already exists" });
	}

	const hashedPassword = await hash(password);

	const user = await create({
		model: UserModel,
		data: {
			firstName,
			lastName,
			email,
			phoneNumber: phoneHash,
			password: hashedPassword,
			gender,
			DOB,
		},
	});

	return { id: user._id, email: user.email };
}
async function issueTokens(user) {
	const accessToken = signAccessToken({ email: user.email }, user._id);
	const refreshToken = signRefreshToken(user._id);
	const expiresAt = new Date(decodeToken(refreshToken).exp * 1000);

	await updateOne({
		model: UserModel,
		filter: { _id: user._id },
		updates: {
			$push: {
				refreshTokens: { tokenHash: hashToken(refreshToken), expiresAt },
			},
		},
	});

	return { accessToken, refreshToken };
}

export async function login({ email, password }) {
	const user = await findOne({ model: UserModel, filter: { email } });

	if (!user || user.provider !== ProviderEnum.SYSTEM) {
		throw BadRequestException({ errmMsg: "Invalid email or password" });
	}

	const correctPassword = await compare(password, user.password);
	if (!correctPassword) {
		throw BadRequestException({ errmMsg: "Invalid email or password" });
	}

	return issueTokens(user);
}
const cleanName = (value, fallback) => {
	const name = (value || "").trim().slice(0, 20);
	return name.length >= 2 ? name : fallback;
};

export async function loginWithGoogle({ idToken }) {
	const payload = await verifyGoogleToken(idToken);

	if (!payload.email_verified) {
		throw BadRequestException({ errmMsg: "Google email is not verified" });
	}

	const email = payload.email.toLowerCase();
	let user = await findOne({ model: UserModel, filter: { email } });

	if (user && user.provider !== ProviderEnum.GOOGLE) {
		throw conflictException({
			errmMsg:
				"This email is registered with a password. Log in with email and password.",
		});
	}

	if (!user) {
		user = await create({
			model: UserModel,
			data: {
				firstName: cleanName(payload.given_name, "User"),
				lastName: cleanName(payload.family_name, "Google"),
				email,
				provider: ProviderEnum.GOOGLE,
				confirmEmail: true,
				profilePicPath: payload.picture,
			},
		});
	}

	return issueTokens(user);
}
export async function refreshTokens({ refreshToken }) {
	if (!refreshToken) {
		throw BadRequestException({ errmMsg: "Refresh token is required" });
	}

	let decoded;
	try {
		decoded = verifyRefreshToken(refreshToken);
	} catch (err) {
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
		updates: {
			$pull: { refreshTokens: { tokenHash: incomingTokenHash } },
		},
	});

	await updateOne({
		model: UserModel,
		filter: { _id: user._id },
		updates: {
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
