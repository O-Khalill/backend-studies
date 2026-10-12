import "dotenv/config";

export const MONGO_URI = process.env.MONGO_URI;
export const SERVER_PORT = process.env.PORT;
export const SALT_ROUNDS = process.env.SALT_ROUNDS;
export const ACCESS_SECRET = process.env.ACCESS_SECRET;
export const REFRESH_SECRET = process.env.REFRESH_SECRET;
