import crypto from "crypto";

export const generateOtp = () =>
	String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
