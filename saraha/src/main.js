import express, { json } from "express";
import { connectDB } from "./DB/index.js";
import { SERVER_PORT } from "./config/config.service.js";
import { notFound } from "./middleware/notFound.middleware.js";
import { globalError } from "./middleware/error.middleware.js";
import { authRouter } from "./modules/auth/auth.controller.js";
import { validateData } from "./middleware/validate.middleware.js";

async function bootStrap() {
  const app = express();

  app.use(json());

  await connectDB();

  app.use("/auth", authRouter);
  app.use(notFound);
  app.use(globalError);
  const server = app.listen(SERVER_PORT, () => {
    console.log("Listening on port " + SERVER_PORT);
  });
}

bootStrap();
