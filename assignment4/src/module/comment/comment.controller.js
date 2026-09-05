import { Router } from "express";
import { bulkCreateComments, updateComment } from "./comment.service.js";

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
