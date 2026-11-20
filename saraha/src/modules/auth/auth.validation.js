import { z } from "zod";
import { GenderEnum } from "../../common/enums/user.enum.js";

export const signupSchema = z
	.object({
		firstName: z.string().trim().min(2).max(20),
		lastName: z.string().trim().min(2).max(20),
		email: z.email().toLowerCase(),
		password: z.string().min(8).max(20),
		phoneNumber: z
			.string()
			.trim()
			.regex(/^\+?\d{10,15}$/, "Invalid phone number"),
		confirmPassword: z.string(),
		gender: z.enum(GenderEnum).optional(),
		DOB: z.coerce.date().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const loginSchema = z.object({
	email: z.email().toLowerCase(),
	password: z.string().min(1),
});
export const googleLoginSchema = z.object({
	idToken: z.string().min(1),
});
export const refreshSchema = z.object({
	refreshToken: z.string().min(1),
});

export const confirmEmailSchema = z.object({
	email: z.email().toLowerCase(),
	otp: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
});
export const resendConfirmationSchema = z.object({
	email: z.email().toLowerCase(),
});
export const otpSchema = z.object({
	otp: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
});

export const disableTwoStepSchema = z.object({
	password: z.string().min(1),
});
