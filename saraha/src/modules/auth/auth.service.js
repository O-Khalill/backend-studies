import bcrypt from "bcrypt";
import { UserModel } from "../../DB/models/user.model.js";
import { create, findOne } from "../../DB/db.repo.js";
import { conflictException } from "../../common/exceptions/app.exception.js";
import { hash } from "../../common/security/hash.js";

export async function signUp({
  firstName,
  lastName,
  email,
  password,
  gender,
  DOB,
}) {
  const exists = await findOne({ model: UserModel, filter: { email } });

  if (exists) {
    throw conflictException({ errmMsg: "User already exists" });
  }

  const hashedPassword = await hash(password);

  const user = await create({
    model: UserModel,
    data: { firstName, lastName, email, password: hashedPassword, gender, DOB },
  });

  return { id: user._id, email: user.email };
}
