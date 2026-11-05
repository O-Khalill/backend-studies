import bcrypt from "bcrypt";
import crypto from "crypto";
import { PHONE_SECRET, SALT_ROUNDS } from "../../config/config.service.js";

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
