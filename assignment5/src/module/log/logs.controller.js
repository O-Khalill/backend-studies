import { createCappedLogs, insertLog } from "./logs.service.js";
import { Router } from "express";

export const logsrouter = new Router();

logsrouter.use("", async (req, res) => {
  try {
    const result = await createCappedLogs();
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
logsrouter.use("/insert-log", async (req, res) => {
  try {
    const { book_id, action } = req.body;
    const result = await insertLog(book_id, action);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
