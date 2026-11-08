import { Router } from "express";
import { getUserProfile } from "./user.service.js";
import { successResponse } from "../../common/responses/success.response.js";
import { authenticate } from "../../middleware/auth.middleware.js";

export const userRouter = new Router();

userRouter.get("/profile", authenticate, async (req, res) => {
	console.log("TEST");
	const userId = req.user.sub;
	console.log(userId);
	const profile = await getUserProfile(userId);
	successResponse({
		res,
		msg: "Profile retrieved successfully",
		data: profile,
	});
});
