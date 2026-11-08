import bcrypt from "bcrypt";
import { UserModel } from "../../DB/models/user.model.js";
import { ProviderEnum } from "../../common/enums/user.enum.js";
import { verifyGoogleToken } from "../../common/utils/google.utils.js";
import { create, findById, findOne, updateOne } from "../../DB/db.repo.js";
import {
	BadRequestException,
	conflictException,
	notFoundException,
} from "../../common/exceptions/app.exception.js";
import { compare, hash, hashPhone } from "../../common/security/hash.js";
import {
	REFRESH_TOKEN_TTL,
	refreshTokenKey,
	signAccessToken,
	signRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
} from "../../common/utils/tokens.utils.js";
import { set, getDel } from "../../DB/redis.repo.js";

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
	await set({
		key: refreshTokenKey(refreshToken),
		value: String(user._id),
		ttl: REFRESH_TOKEN_TTL,
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
	let decoded;
	try {
		decoded = verifyRefreshToken(refreshToken);
	} catch {
		throw BadRequestException({ errmMsg: "Invalid or expired refresh token" });
	}

	const userId = await getDel({ key: refreshTokenKey(refreshToken) });
	if (!userId) {
		throw BadRequestException({ errmMsg: "Invalid session or refresh key" });
	}

	const user = await findById({ model: UserModel, id: decoded.sub });
	if (!user) {
		throw BadRequestException({ errmMsg: "Invalid session or refresh key" });
	}

	return issueTokens(user);
}
