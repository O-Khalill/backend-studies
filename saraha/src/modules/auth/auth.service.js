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
import { sendOtp, verifyOtp } from "../../common/security/otp.js";
import { EmailSubjectEnum } from "../../common/enums/email.enum.js";
const LOGIN_MAX_FAILURES = 5;
const LOGIN_LOCK_TTL = 5 * 60;
const loginFailKey = (email) => `login:fail:${email}`;

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

	await verifyOtp({ email, subject: EmailSubjectEnum.ConfirmEmail, otp });

	await updateOne({
		model: UserModel,
		filter: { _id: user._id },
		updates: { confirmEmail: true },
	});
	return { email };
}
export async function resendConfirmation({ email }) {
	const user = await findOne({ model: UserModel, filter: { email } });
	if (!user || user.confirmEmail) return;

	const sent = await sendOtp({
		email,
		subject: EmailSubjectEnum.ConfirmEmail,
		subjectLine: "Confirm your email",
	});
	if (!sent) {
		throw BadRequestException({
			errmMsg: "Please wait before requesting another code",
		});
	}
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
		await sendOtp({
			email,
			subject: EmailSubjectEnum.ConfirmEmail,
			subjectLine: "Confirm your email",
		});
	} catch (err) {
		console.error("Failed to send confirmation email:", err.message);
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

export async function verifyLoginTwoStep({ email, otp }) {
	const user = await findOne({ model: UserModel, filter: { email } });
	if (!user || !user.twoFactorEnabled) {
		throw BadRequestException({ errmMsg: "Invalid or expired code" });
	}

	await verifyOtp({ email, subject: EmailSubjectEnum.TwoStepLogin, otp });
	return issueTokens(user);
}

export async function requestEnableTwoStep(userId) {
	const user = await findById({ model: UserModel, id: userId });
	if (!user) throw notFoundException({ errmMsg: "User not found" });
	if (user.provider !== ProviderEnum.SYSTEM) {
		throw BadRequestException({
			errmMsg: "2FA is only available for password accounts",
		});
	}
	if (user.twoFactorEnabled) {
		throw BadRequestException({ errmMsg: "2FA is already enabled" });
	}

	const sent = await sendOtp({
		email: user.email,
		subject: EmailSubjectEnum.EnableTwoStep,
		subjectLine: "Enable two-step verification",
	});
	if (!sent) {
		throw BadRequestException({
			errmMsg: "Please wait before requesting another code",
		});
	}
}

export async function confirmEnableTwoStep({ userId, otp }) {
	const user = await findById({ model: UserModel, id: userId });
	if (!user) throw notFoundException({ errmMsg: "User not found" });
	if (user.twoFactorEnabled) {
		throw BadRequestException({ errmMsg: "2FA is already enabled" });
	}

	await verifyOtp({
		email: user.email,
		subject: EmailSubjectEnum.EnableTwoStep,
		otp,
	});

	await updateOne({
		model: UserModel,
		filter: { _id: user._id },
		updates: { twoFactorEnabled: true },
	});
}

export async function disableTwoStep({ userId, password }) {
	const user = await findById({ model: UserModel, id: userId });
	if (!user) throw notFoundException({ errmMsg: "User not found" });
	if (!user.twoFactorEnabled) {
		throw BadRequestException({ errmMsg: "2FA is not enabled" });
	}

	const correctPassword = await compare(password, user.password);
	if (!correctPassword) {
		throw BadRequestException({ errmMsg: "Invalid password" });
	}

	await updateOne({
		model: UserModel,
		filter: { _id: user._id },
		updates: { twoFactorEnabled: false },
	});
}

export async function login({ email, password }) {
	const failures = Number(await get({ key: loginFailKey(email) })) || 0;
	if (failures >= LOGIN_MAX_FAILURES) {
		throw TooManyRequestsException({
			errmMsg: "Too many failed attempts. Try again later.",
		});
	}

	const user = await findOne({ model: UserModel, filter: { email } });

	const valid =
		user &&
		user.provider === ProviderEnum.SYSTEM &&
		(await compare(password, user.password));

	if (!valid) {
		const count = await incr({ key: loginFailKey(email) });
		if (count === 1) {
			await expire({ key: loginFailKey(email), ttl: LOGIN_LOCK_TTL });
		}
		throw BadRequestException({ errmMsg: "Invalid email or password" });
	}

	if (!user.confirmEmail) {
		throw ForbiddenException({ errmMsg: "Please confirm your email first" });
	}
	await del({ key: loginFailKey(email) });

	if (user.twoFactorEnabled) {
		await sendOtp({
			email,
			subject: EmailSubjectEnum.TwoStepLogin,
			subjectLine: "Your login code",
		});
		return { twoFactorRequired: true };
	}

	return issueTokens(user);
}
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

export async function logout({ user, refreshToken }) {
	let decoded;
	try {
		decoded = verifyRefreshToken(refreshToken);
	} catch {
		throw BadRequestException({ errmMsg: "Invalid or expired refresh token" });
	}

	if (decoded.sub !== user.sub) {
		throw BadRequestException({ errmMsg: "Invalid refresh token" });
	}

	await del({ key: refreshTokenKey(refreshToken) });

	const remaining = user.exp - Math.floor(Date.now() / 1000);
	if (user.jti && remaining > 0) {
		await set({ key: `blacklist:${user.jti}`, value: "1", ttl: remaining });
	}
}
