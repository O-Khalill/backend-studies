import { Router } from "express";
import { createAuthorImplicit } from "./author.service.js";

export const authorRouter = new Router();

authorRouter.post("", async (req, res) => {
  try {
    const { name, nationality } = req.body;
    const author = await createAuthorImplicit({ name, nationality });
    res.status(200).json({ message: author });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
