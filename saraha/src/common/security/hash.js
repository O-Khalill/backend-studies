import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../../config/config.service.js";

export function hash(plainText) {
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

export function compare(plainText, hashed) {
  return bcrypt.compare(plainText, hashed);
}
