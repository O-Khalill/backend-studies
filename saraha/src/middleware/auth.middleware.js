import {
	BadRequestException,
	UnauthorizedException,
} from "../common/exceptions/app.exception.js";
import { verifyAccessToken } from "../common/utils/tokens.utils.js";

export const authenticate = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	console.log(authHeader);
	if (!authHeader || !authHeader.toLowerCase().startsWith("bearer")) {
		return next(
			BadRequestException({ errmMsg: "Token is missing or invalid" }),
		);
	}

	const token = authHeader.split(" ")[1];
	try {
		req.user = await verifyAccessToken(token);
		next();
	} catch (err) {
		console.log(err);
		throw UnauthorizedException({ errmMsg: "Invalid or expired access token" });
	}
};
