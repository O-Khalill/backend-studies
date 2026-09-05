import { Router } from "express";
import {
  checkEmail,
  createUser,
  getAllData,
  getUserByEmail,
  getUserById,
  updateUser,
} from "./user.service.js";

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  try {
    const usersData = await getAllData();
    res.status(200).json({ data: usersData });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

userRouter.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const userData = await getUserByEmail(email);
    res.status(201).json({ data: userData });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

userRouter.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await getUserById(id);
    res.status(201).json({ data: userData });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userData = await createUser({ name, email, password });
    res
      .status(201)
      .json({ data: userData, message: "Added user successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

userRouter.put("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await updateUser(id, req.body);
    res.status(200).json({ data: userData });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});
