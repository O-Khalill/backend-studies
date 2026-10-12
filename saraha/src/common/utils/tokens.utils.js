import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ACCESS_SECRET, REFRESH_SECRET } from "../../config/config.service.js";

export const signAccessToken = (payload = {}, subject) =>
  jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: "15m",
    subject: string(subject),
  });

export const signRefreshToken = (subject) =>
  jwt.sign({}, REFRESH_SECRET, {
    expiresIn: "1d",
    subject: String(subject),
  });

export const verifyAccesstoken = (token) => jwt.verify(token, ACCESS_SECRET);
export const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);
export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
