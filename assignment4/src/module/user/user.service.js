import { where } from "sequelize";
import users from "../../model/user.model.js";

export async function checkEmail(email) {
  const exists = await users.findOne({ where: { email } });
  return exists ? 1 : 0;
}

export async function checkId(id) {
  const exists = await users.findByPk(id);
  return exists ? 1 : 0;
}

export async function createUser(userData) {
  const exists = await checkEmail(userData.email);

  if (exists) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }
  const user = users.build(userData);
  await user.save();
  return user;
}

export async function updateUser(id, updates) {
  const exists = await checkId(id);
  if (!exists) {
    const error = new Error("User does not exist");
    error.statusCode = 404;
    throw error;
  }
  const user = await users.findByPk(id);
  await user.update(updates);
  return user;
}

// testing if my code works
export async function getAllData() {
  const usersData = await users.findAll();
  return usersData;
}

export async function getUserByEmail(email) {
  const userData = await users.findOne({ where: { email } });
  if (!userData) {
    const error = new Error("Email does not exist");
    error.statusCode = 404;
    throw error;
  }
  return userData;
}

export async function getUserById(id) {
  const userData = await users.findOne({
    where: { id },
    attributes: { exclude: ["role"] },
  });

  if (!userData) {
    const error = new Error("id does not exist");
    error.statusCode = 404;
    throw error;
  }
  return userData;
}
