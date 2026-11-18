import { Router } from "express";
import {
	login,
	signUp,
	refreshTokens,
	loginWithGoogle,
	resendConfirmation,
	confirmEmail,
} from "./auth.service.js";
import { successResponse } from "../../common/responses/success.response.js";
import { validateData } from "../../middleware/validate.middleware.js";
import {
	loginSchema,
	signupSchema,
	googleLoginSchema,
	refreshSchema,
	confirmEmailSchema,
	resendConfirmationSchema,
} from "./auth.validation.js";

export const authRouter = new Router();

authRouter.post("/signup", validateData(signupSchema), async (req, res) => {
	const body = req.body;
	const user = await signUp(body);
	successResponse({ res, msg: "User signed up", data: user });
});
authRouter.post("/login", validateData(loginSchema), async (req, res) => {
	const body = req.body;
	const user = await login(body);
	successResponse({ res, msg: "User logged in succesfully", data: user });
});

authRouter.post("/refresh", validateData(refreshSchema), async (req, res) => {
	const { refreshToken } = req.body;

	const tokens = await refreshTokens({ refreshToken });

	res.status(200).json({
		msg: "Tokens refreshed successfully",
		data: tokens,
	});
});

authRouter.post(
	"/google",
	validateData(googleLoginSchema),
	async (req, res) => {
		const tokens = await loginWithGoogle(req.body);
		successResponse({ res, msg: "Logged in with Google", data: tokens });
	},
);

authRouter.post(
	"/confirm-email",
	validateData(confirmEmailSchema),
	async (req, res) => {
		const data = await confirmEmail(req.body);
		successResponse({ res, msg: "Email confirmed", data });
	},
);

authRouter.post(
	"/resend-confirmation",
	validateData(resendConfirmationSchema),
	async (req, res) => {
		await resendConfirmation(req.body);
		successResponse({
			res,
			msg: "If the account exists, a new code has been sent",
		});
	},
);
