import bcrypt from "bcrypt";
import crypto from "crypto";
import {
	OTP_SECRET,
	PHONE_SECRET,
	SALT_ROUNDS,
} from "../../config/config.service.js";

export function hash(plainText) {
	return bcrypt.hash(plainText, SALT_ROUNDS);
}

export function compare(plainText, hashed) {
	return bcrypt.compare(plainText, hashed);
}

export function hashPhone(phoneNumber) {
	return crypto
		.createHmac("SHA256", PHONE_SECRET)
		.update(phoneNumber)
		.digest("hex");
}

export function hashOTP(otp) {
	return crypto.createHmac("SHA256", OTP_SECRET).update(otp).digest("hex");
}
