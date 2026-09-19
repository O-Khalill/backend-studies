import { db } from "../DB/connection.db.js";

export const logs = () => db.collection("logs");
