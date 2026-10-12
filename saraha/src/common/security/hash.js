import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../../config/config.service.js";

export async function hash(plainText) {
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

export async function compare(plainText, hashed) {
  return bcrypt.compare(plainText, hashed);
}
