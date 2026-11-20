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

export const incr = ({ key }) => redisClient.incr(key);
export const expire = ({ key, ttl }) => redisClient.expire(key, ttl);

export const getTtl = ({ key }) => redisClient.ttl(key);
