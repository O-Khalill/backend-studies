import { db } from "../DB/connection.db.js";

export const books = () => db.collection("books");
