import { Router } from "express";
import {
  bulkCreateComments,
  findOrCreateComment,
  updateComment,
  searchComments,
  getCommentDetails,
  getNewestComments,
} from "./comment.service.js";

export const commentRouter = Router();

commentRouter.post("/bulk", async (req, res) => {
  try {
    const { comments } = req.body;
    console.log("req body is working");
    const bulkComments = await bulkCreateComments(comments);
    res.status(200).json({ data: bulkComments });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

commentRouter.put("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, ...commentData } = req.body;
    const updatedComment = await updateComment(id, commentData, userId);
    res.status(200).json({ data: updatedComment });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});
commentRouter.post("/find-or-create", async (req, res) => {
  try {
    const { postId, content, userId } = req.body;
    const result = await findOrCreateComment(postId, content, userId);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

commentRouter.get("/search", async (req, res) => {
  try {
    const { word } = req.query;
    const result = await searchComments(word);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});
commentRouter.get("/details/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await getCommentDetails(id);
    res.status(200).json({ data: comment });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

commentRouter.get("/newest/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await getNewestComments(postId);
    res.status(200).json({ data: comments });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});
