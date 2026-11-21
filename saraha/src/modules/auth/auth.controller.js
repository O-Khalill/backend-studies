import { Router } from "express";
import {
	login,
	signUp,
	refreshTokens,
	loginWithGoogle,
	resendConfirmation,
	confirmEmail,
	requestEnableTwoStep,
	verifyLoginTwoStep,
	confirmEnableTwoStep,
	disableTwoStep,
	logout,
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
	otpSchema,
	disableTwoStepSchema,
} from "./auth.validation.js";
import { rateLimit } from "../../middleware/ratelimit.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";

export const authRouter = new Router();
const loginLimiter = rateLimit({ name: "login", max: 5, windowSec: 5 * 60 });
const twoStepLimiter = rateLimit({ name: "2fa", max: 5, windowSec: 5 * 60 });

authRouter.post("/signup", validateData(signupSchema), async (req, res) => {
	const body = req.body;
	const user = await signUp(body);
	successResponse({ res, msg: "User signed up", data: user });
});
authRouter.post(
	"/login",
	loginLimiter,
	validateData(loginSchema),
	async (req, res) => {
		const result = await login(req.body);
		successResponse({
			res,
			msg: result.twoFactorRequired
				? "Verification code sent to your email"
				: "User logged in succesfully",
			data: result,
		});
	},
);

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
authRouter.post(
	"/login/verify-2fa",
	twoStepLimiter,
	validateData(confirmEmailSchema),
	async (req, res) => {
		const tokens = await verifyLoginTwoStep(req.body);
		successResponse({ res, msg: "User logged in succesfully", data: tokens });
	},
);

authRouter.post(
	"/2fa/enable",
	authenticate,
	twoStepLimiter,
	async (req, res) => {
		await requestEnableTwoStep(req.user.sub);
		successResponse({ res, msg: "Verification code sent to your email" });
	},
);

authRouter.post(
	"/2fa/confirm",
	authenticate,
	twoStepLimiter,
	validateData(otpSchema),
	async (req, res) => {
		await confirmEnableTwoStep({ userId: req.user.sub, otp: req.body.otp });
		successResponse({ res, msg: "Two-step verification enabled" });
	},
);

authRouter.post(
	"/2fa/disable",
	authenticate,
	twoStepLimiter,
	validateData(disableTwoStepSchema),
	async (req, res) => {
		await disableTwoStep({
			userId: req.user.sub,
			password: req.body.password,
		});
		successResponse({ res, msg: "Two-step verification disabled" });
	},
);

authRouter.post(
	"/logout",
	authenticate,
	validateData(refreshSchema),
	async (req, res) => {
		await logout({ user: req.user, refreshToken: req.body.refreshToken });
		successResponse({ res, msg: "Logged out successfully" });
	},
);
