import { db } from "../DB/connection.db.js";

export const authors = () => db.collection("authors");
