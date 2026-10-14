import { verifyAccessToken } from "../security/jwt.js";
import { BadRequestException } from "../exceptions/app.exception.js";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    throw BadRequestException({ errmMsg: "Token is missing or invalid" });
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    throw UnauthorizedException({ errmMsg: "Invalid or expired access token" });
  }
};
