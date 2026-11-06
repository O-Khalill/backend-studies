import "dotenv/config";

export const MONGO_URI = process.env.MONGO_URI;
export const SERVER_PORT = process.env.PORT;
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
export const ACCESS_SECRET = process.env.ACCESS_SECRET;
export const REFRESH_SECRET = process.env.REFRESH_SECRET;
export const PHONE_SECRET = process.env.PHONE_SECRET;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
