import express from "express";
import test, { sequelize } from "./DB/connection.db.js";
import user from "./model/user.model.js";
import Post from "./model/post.model.js";
import Comment from "./model/comment.model.js";
import { globalErr } from "./middleware/globalErr.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";
import { userRouter } from "./module/user/user.controller.js";
import { postRouter } from "./module/post/post.controller.js";
import { commentRouter } from "./module/comment/comment.controller.js";
async function bootStrap() {
  const app = express();
  app.use(express.json());

  await test();
  user.hasMany(Post, { foreignKey: "userId" });
  Post.belongsTo(user, { foreignKey: "userId" });

  Post.hasMany(Comment, { foreignKey: "postId" });
  Comment.belongsTo(Post, { foreignKey: "postId" });

  user.hasMany(Comment, { foreignKey: "userId" });
  Comment.belongsTo(user, { foreignKey: "userId" });

  await sequelize.sync({ alter: false });

  app.use("/user", userRouter);
  app.use("/post", postRouter);
  app.use("/comment", commentRouter);

  app.use(notFound);
  app.use(globalErr);

  app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT);
  });
}

bootStrap();
