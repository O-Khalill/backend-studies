import { notFoundException } from "../../common/exceptions/app.exception.js";
import { findById, findOne } from "../../DB/db.repo.js";
import { UserModel } from "../../DB/models/user.model.js";

export async function getUserProfile(userId) {
  const user = await findById({ model: UserModel, id: userId });

  if (!user) {
    throw notFoundException();
  }

  return { id: user._id, email: user.email };
}
