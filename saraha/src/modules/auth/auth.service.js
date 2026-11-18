import bcrypt from "bcrypt";
import { generateOtp } from "../../common/utils/otp.js";
import { sendEmail } from "../../common/utils/email.utils.js";
import { UserModel } from "../../DB/models/user.model.js";
import { ProviderEnum } from "../../common/enums/user.enum.js";
import { verifyGoogleToken } from "../../common/utils/google.utils.js";
import { create, findById, findOne, updateOne } from "../../DB/db.repo.js";
import {
	BadRequestException,
	conflictException,
	notFoundException,
	ForbiddenException,
} from "../../common/exceptions/app.exception.js";
import {
	compare,
	hash,
	hashPhone,
	hashOTP,
} from "../../common/security/hash.js";
import {
	REFRESH_TOKEN_TTL,
	refreshTokenKey,
	signAccessToken,
	signRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
} from "../../common/utils/tokens.utils.js";
import { set, getDel, del, incr, expire, get } from "../../DB/redis.repo.js";
const OTP_TTL = 10 * 60;
const ATTEMPTS_TTL = 60 * 60;
const OTP_MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN = 60;

const otpKey = (email) => `otp:confirm:${email}`;
const attemptsKey = (email) => `otp:attempts:${email}`;
const cooldownKey = (email) => `otp:cooldown:${email}`;
async function sendConfirmationEmail(email) {
	const otp = generateOtp();
	await set({ key: otpKey(email), value: hashOTP(otp), ttl: OTP_TTL });
	await set({ key: cooldownKey(email), value: "1", ttl: RESEND_COOLDOWN });
	await sendEmail({
		to: email,
		subject: "Confirm your email",
		html: `<p>Your confirmation code is <b>${otp}</b>. It expires in 10 minutes.</p>`,
	});
}

export async function confirmEmail({ email, otp }) {
	const user = await findOne({ model: UserModel, filter: { email } });
	if (!user) throw BadRequestException({ errmMsg: "Invalid or expired code" });
	if (user.confirmEmail) {
		throw BadRequestException({ errmMsg: "Email already confirmed" });
	}

	const attempts = await incr({ key: attemptsKey(email) });
	if (attempts === 1)
		await expire({ key: attemptsKey(email), ttl: ATTEMPTS_TTL });
	if (attempts > OTP_MAX_ATTEMPTS) {
		throw BadRequestException({
			errmMsg: "Too many attempts. Try again later.",
		});
	}

	const stored = await get({ key: otpKey(email) });
	if (!stored || stored !== hashOTP(otp)) {
		throw BadRequestException({ errmMsg: "Invalid or expired code" });
	}

	await updateOne({
		model: UserModel,
		filter: { _id: user._id },
		updates: { confirmEmail: true },
	});
	await del({ key: otpKey(email) });
	await del({ key: attemptsKey(email) });
	return { email };
}

export async function resendConfirmation({ email }) {
	const user = await findOne({ model: UserModel, filter: { email } });
	if (!user || user.confirmEmail) return;
	if (await get({ key: cooldownKey(email) })) {
		throw BadRequestException({
			errmMsg: "Please wait before requesting another code",
		});
	}
	await sendConfirmationEmail(email);
}
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
	try {
		await sendConfirmationEmail(email);
	} catch (err) {
		console.error("Failed to send confirmation email:", err.message);
	}
	if (!user.confirmEmail) {
		throw ForbiddenException({ errmMsg: "Please confirm your email first" });
	}
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
