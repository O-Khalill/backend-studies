import { Router } from "express";
import {
  createPost,
  getPostById,
  deletePost,
  getallPosts,
  getCommentCount,
  getPostsDetails,
} from "./post.service.js";

export const postRouter = Router();

postRouter.post("/", async (req, res) => {
  try {
    const postData = req.body;
    const post = await createPost(postData);
    res.status(200).json({ message: "Post added successfully", data: post });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

postRouter.delete("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await deletePost(id, userId);
    res
      .status(200)
      .json({ message: "Deleted message successfully", data: post });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

postRouter.get("/details", async (req, res) => {
  try {
    const posts = await getallPosts();
    res.status(200).json({ data: posts });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error });
  }
});
postRouter.get("/details/comment-count", async (req, res) => {
  try {
    const posts = await getPostsDetails();
    res.status(200).json({ data: posts });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error });
  }
});
