import Router from "express";
import {
  signUp,
  login,
  updateInfo,
  deleteUser,
  getUserById,
} from "./user.service.js";
export const userRouter = new Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const userData = req.body;
    const user = await signUp(userData);
    res.status(200).json({ message: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await login({ email, password });
    res.status(200).json({ message: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

userRouter.patch("/:id", async (req, res) => {
  try {
    const user = await updateInfo(req.params.id, req.body);
    res.status(200).json({
      message: "User updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

userRouter.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await deleteUser(req.params.id);
    res.status(200).json({ message: "Deleted user successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});
userRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await getUserById(id);
    res.status(200).json({ message: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});
