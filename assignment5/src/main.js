import { client, connect } from "./DB/connection.db.js";
import express from "express";
import { bookRouter } from "./module/book/book.controller.js";
import { authorRouter } from "./module/author/author.controller.js";
import { logsrouter } from "./module/log/logs.controller.js";
async function bootStrap() {
  const app = express();
  app.use(express.json());
  await connect();

  app.use("/collection/books", bookRouter);
  app.use("/collection/authors", authorRouter);
  app.use("/collection/logs", logsrouter);

  app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT);
  });
}

bootStrap();
