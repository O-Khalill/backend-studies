import { incr, expire, getTtl } from "../DB/redis.repo.js";
import { TooManyRequestsException } from "../common/exceptions/app.exception.js";

export const rateLimit = ({ name, max, windowSec }) => {
	return async (req, res, next) => {
		const key = `ratelimit:${name}:${req.ip}`;

		const count = await incr({ key });
		let remaining = await getTtl({ key });

		if (remaining < 0) {
			await expire({ key, ttl: windowSec });
			remaining = windowSec;
		}

		if (count > max) {
			res.set("Retry-After", String(remaining));
			return next(
				TooManyRequestsException({
					errmMsg: `Too many attempts. Try again in ${remaining} seconds.`,
				}),
			);
		}

		next();
	};
};
