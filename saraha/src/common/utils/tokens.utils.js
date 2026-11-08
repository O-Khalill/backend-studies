import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ACCESS_SECRET, REFRESH_SECRET } from "../../config/config.service.js";

export const ACCESS_TOKEN_TTL = 15 * 60;

export const REFRESH_TOKEN_TTL = 24 * 60 * 60;

export const signAccessToken = (payload = {}, subject) =>
	jwt.sign(payload, ACCESS_SECRET, {
		expiresIn: ACCESS_TOKEN_TTL,
		subject: String(subject),
	});

export const signRefreshToken = (subject) =>
	jwt.sign({}, REFRESH_SECRET, {
		expiresIn: REFRESH_TOKEN_TTL,
		subject: String(subject),
		jwtid: crypto.randomUUID(),
	});

export const decodeToken = (token) => jwt.decode(token);
export const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);
export const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);
export const hashToken = (token) =>
	crypto.createHash("sha256").update(token).digest("hex");
export const refreshTokenKey = (token) => `refresh:${hashToken(token)}`;
