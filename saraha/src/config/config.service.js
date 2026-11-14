import "dotenv/config";

export const MONGO_URI = process.env.MONGO_URI;
export const SERVER_PORT = process.env.PORT;
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
export const ACCESS_SECRET = process.env.ACCESS_SECRET;
export const REFRESH_SECRET = process.env.REFRESH_SECRET;
export const PHONE_SECRET = process.env.PHONE_SECRET;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const UPSTASH_REDIS_REST_URL = process.env.REDIS_URL;

export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = Number(process.env.EMAIL_PORT);
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
