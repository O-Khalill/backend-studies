import { redisClient } from "./connection.redis.js";

export const set = ({ key, value, ttl }) =>
	redisClient.set(
		key,
		value,
		ttl ? { expiration: { type: "EX", value: ttl } } : {},
	);

export const get = ({ key }) => redisClient.get(key);

export const getDel = ({ key }) => redisClient.getDel(key);

export const del = ({ key }) => redisClient.del(key);
