import { UnauthorizedException } from "../common/exceptions/app.exception.js";
import { verifyAccessToken } from "../common/utils/tokens.utils.js";
import { get } from "../DB/redis.repo.js";

export const authenticate = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
		return next(
			UnauthorizedException({ errmMsg: "Token is missing or invalid" }),
		);
	}

	const token = authHeader.split(" ")[1];

	let payload;
	try {
		payload = verifyAccessToken(token);
	} catch {
		return next(
			UnauthorizedException({ errmMsg: "Invalid or expired access token" }),
		);
	}

	if (payload.jti && (await get({ key: `blacklist:${payload.jti}` }))) {
		return next(UnauthorizedException({ errmMsg: "Token has been revoked" }));
	}

	req.user = payload;
	next();
};
