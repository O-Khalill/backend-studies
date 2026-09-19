import { db } from "../../DB/connection.db.js";
import { ObjectId } from "mongodb";
export async function createCappedLogs() {
  return await db.command({
    create: "logs",
    capped: true,
    size: 1024 * 1024,
  });
}

export async function insertLog({ book_id, action }) {
  return await logs().insertOne({
    book_id: new ObjectId(book_id),
    action,
  });
}
