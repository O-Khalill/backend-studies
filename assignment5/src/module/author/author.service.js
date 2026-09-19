import { authors } from "../../model/authors.model.js";

export async function createAuthorImplicit(data) {
  return await authors().insertOne(data);
}
