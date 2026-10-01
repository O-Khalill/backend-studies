import { connectDB } from "./DB/connection.db.js";
import express from "express";
import { globalErrorHandling } from "./middleware/globalErrorHandling.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";
import { userRouter } from "./modules/user/user.controller.js";
import { notesRouter } from "./modules/notes/notes.controller.js";

async function bootStrap() {
  const app = express();
  app.use(express.json());

  app.use("/users", userRouter);
  app.use("/notes", notesRouter);

  app.listen(process.env.PORT, () => {
    console.log("Server is running on port  " + process.env.PORT);
  });
  app.use(notFound);
  app.use(globalErrorHandling);

  await connectDB();
}

bootStrap();
