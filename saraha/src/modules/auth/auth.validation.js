import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(2).max(20),
    lastName: z.string().trim().min(2).max(20),
    email: z.email().toLowerCase(),
    password: z.string().min(8).max(20),
    confirmPassword: z.string(),
    gender: z.number().optional(),
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
