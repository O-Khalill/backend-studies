import { where } from "sequelize";
import Comment from "../../model/comment.model.js";
import users from "../../model/user.model.js";
import Post from "../../model/post.model.js";

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

export async function findOrCreateComment(postId, content, userId) {
  const [comment, created] = await Comment.findOrCreate({
    where: { postId, content, userId },
    defaults: { postId, content, userId },
  });
  return { comment, created };
}

import { Op } from "sequelize";

export async function searchComments(word) {
  if (!word) {
    const error = new Error("A search word is required");
    error.statusCode = 400;
    throw error;
  }

  const { count, rows } = await Comment.findAndCountAll({
    where: {
      content: {
        [Op.like]: `%${word}%`,
      },
    },
  });

  return { count, comments: rows };
}

export async function getCommentDetails(id) {
  const comment = await Comment.findByPk(id, {
    include: [users, Post],
  });
  if (!comment) {
    const error = new Error("Comment does not exist");
    error.statusCode = 404;
    throw error;
  }
  return comment;
}

export async function getNewestComments(postId) {
  const comments = await Comment.findAll({
    where: { postId },
    order: [["createdAt", "DESC"]],
    limit: 3,
  });
  return comments;
}
