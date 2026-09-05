import { where } from "sequelize";
import Comment from "../../model/comment.model.js";

export async function bulkCreateComments(commentData) {
  if (!Array.isArray(commentData) || commentData.length === 0) {
    const error = new Error("Can't have an empty comment");
    error.statusCode = 400;
    throw error;
  }
  const comments = await Comment.bulkCreate(commentData);
  return comments;
}

export async function findCommentById(id) {
  const exists = await Comment.findByPk(id);
  return exists ? 1 : 0;
}

export async function updateComment(id, commentData, reqUserId) {
  const exists = await findCommentById(id);
  const comment = await Comment.findByPk(id);
  if (comment.userId !== Number(reqUserId) || !exists) {
    const error = new Error("You are not authorised to update this comment");
    error.statusCode = 403;
    throw error;
  }
  const updatedComment = await comment.update(commentData);
  return updatedComment;
}
