import { User } from "../../models/users.model.js";
import mongoose from "mongoose";
export async function userExists(email) {
  const user = await User.exists({ email });

  return user !== null;
}

export async function signUp(data) {
  const { name, email, password, phone, age } = data;

  if (await userExists(email)) {
    const error = new Error("Email exists");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({ name, email, password, phone, age });
  return user;
}

export async function login({ email, password }) {
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    const error = new Error("invalid email or password");
    error.statusCode = 400;
    throw error;
  }
  return user;
}

export async function updateInfo(id, data = {}) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("Invalid user id");
    error.statusCode = 400;
    throw error;
  }

  const { name, email, phone, age } = data;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (phone !== undefined) updates.phone = phone;
  if (age !== undefined) updates.age = age;

  if (updates.email) {
    const taken = await User.exists({ email });
    if (taken) {
      const error = new Error("Email exists");
      error.statusCode = 400;
      throw error;
    }
  }

  const user = await User.findByIdAndUpdate(id, updates, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

export async function deleteUser(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("Invalid id");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    const error = new Error("Invalid id");
    error.statusCode = 404;
    throw error;
  }
  return user;
}

export async function getUserById(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("Invalid id");
    error.statusCode = 400;
    throw error;
  }
  const user = await User.findById(id);

  if (!user) {
    const error = new Error("Invalid id");
    error.statusCode = 404;
    throw error;
  }
  return user;
}
