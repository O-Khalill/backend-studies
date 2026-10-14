import { Router } from "express";
import { login, signUp, refreshTokens } from "./auth.service.js";
import { successResponse } from "../../common/responses/success.response.js";
import { validateData } from "../../middleware/validate.middleware.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

export const authRouter = new Router();

authRouter.post("/signup", validateData(signupSchema), async (req, res) => {
  try {
    const body = req.body;
    const user = await signUp(body);
    successResponse({ res, msg: "User signed up", data: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});
authRouter.post("/login", validateData(loginSchema), async (req, res) => {
  try {
    const body = req.body;
    const user = await login(body);
    successResponse({ res, msg: "User logged in succesfully", data: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

authRouter.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const tokens = await refreshTokens({ refreshToken });

    res.status(200).json({
      msg: "Tokens refreshed successfully",
      data: tokens,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});
