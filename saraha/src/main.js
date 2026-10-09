import express, { json } from "express";
import { connectDB } from "./DB/index.js";
import { SERVER_PORT } from "./config/index.js";
import { notFound } from "./middleware/notFound.middleware.js";
import { globalError } from "./middleware/error.middleware.js";

async function bootStrap() {
  const app = express();

  app.use(json());

  await connectDB;

  app.use(notFound);
  app.use(globalError);
  const server = app.listen(SERVER_PORT, () => {
    console.log("Listening on port " + SERVER_PORT);
  });
}

bootStrap();
