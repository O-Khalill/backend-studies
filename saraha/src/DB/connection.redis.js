import { createClient } from "redis";
import { UPSTASH_REDIS_REST_URL } from "../config/config.service.js";

export const redisClient = createClient({ url: UPSTASH_REDIS_REST_URL });

redisClient.on("error", (err) => console.error("Redis error:", err.message));

export async function connectRedis() {
	try {
		await redisClient.connect();
		console.log("Connected to Redis successfully");
	} catch (error) {
		console.error("Couldn't connect to Redis: " + error.message);
		process.exit(1);
	}
}
