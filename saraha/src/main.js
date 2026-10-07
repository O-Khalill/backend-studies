import express, { json } from "express";
import { connectDB } from "./DB/index.js";
import { SERVER_PORT } from "./config/index.js";

async function bootStrap() {
  const app = express();

  app.use(json());

  await connectDB();

  const server = app.listen(SERVER_PORT, () => {
    console.log("Listening on port " + SERVER_PORT);
  });
}

bootStrap();
