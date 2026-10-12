import { Router } from "express";
import { signUp } from "./auth.service.js";
import { successResponse } from "../../common/responses/success.response.js";

export const authRouter = new Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const body = req.body;
    const user = await signUp(body);
    successResponse({ res, msg: "User signed up", data: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});
