import { set, get, del, incr, expire, getTtl } from "../../DB/redis.repo.js";
import { generateOtp } from "../utils/otp.js";
import { sendEmail } from "../utils/email.utils.js";
import { hashOTP } from "./hash.js";
import {
	BadRequestException,
	TooManyRequestsException,
} from "../exceptions/app.exception.js";

const OTP_TTL = 10 * 60;
const TRIALS_TTL = 15 * 60;
const MAX_TRIALS = 5;
const BAN_TTL = 60 * 60;
const RESEND_COOLDOWN = 60;

const otpKey = (email, subject) => `otp:${subject}:${email}`;
const trialsKey = (email, subject) => `otp:${subject}:${email}:trials`;
const bannedKey = (email, subject) => `otp:${subject}:${email}:banned`;
const cooldownKey = (email, subject) => `otp:${subject}:${email}:cooldown`;

async function assertNotBanned(email, subject) {
	const remaining = await getTtl({ key: bannedKey(email, subject) });
	if (remaining > 0) {
		throw TooManyRequestsException({
			errmMsg: `Too many attempts. Try again in ${Math.ceil(remaining / 60)} minutes.`,
		});
	}
}

export async function sendOtp({ email, subject, subjectLine }) {
	await assertNotBanned(email, subject);
	if (await get({ key: cooldownKey(email, subject) })) return false;

	const otp = generateOtp();
	await set({ key: otpKey(email, subject), value: hashOTP(otp), ttl: OTP_TTL });
	await set({
		key: cooldownKey(email, subject),
		value: "1",
		ttl: RESEND_COOLDOWN,
	});
	await sendEmail({
		to: email,
		subject: subjectLine,
		html: `<p>Your code is <b>${otp}</b>. It expires in 10 minutes.</p>`,
	});
	return true;
}

export async function verifyOtp({ email, subject, otp }) {
	await assertNotBanned(email, subject);

	const stored = await get({ key: otpKey(email, subject) });
	if (stored && stored === hashOTP(otp)) {
		await del({ key: otpKey(email, subject) });
		await del({ key: trialsKey(email, subject) });
		return;
	}

	const trials = await incr({ key: trialsKey(email, subject) });
	if (trials === 1) {
		await expire({ key: trialsKey(email, subject), ttl: TRIALS_TTL });
	}

	if (trials >= MAX_TRIALS) {
		await set({ key: bannedKey(email, subject), value: "1", ttl: BAN_TTL });
		await del({ key: otpKey(email, subject) });
		await del({ key: trialsKey(email, subject) });
		throw TooManyRequestsException({
			errmMsg: "Too many attempts. You are temporarily banned.",
		});
	}

	throw BadRequestException({ errmMsg: "Invalid or expired code" });
}
