import Comment from "../../model/comment.model.js";
import Post from "../../model/post.model.js";
import users from "../../model/user.model.js";

export async function createPost(postData) {
  if (!postData) {
    const error = new Error("Post can't be empty");
    error.statusCode = 400;
    throw error;
  }
  const post = await Post.build(postData);
  await post.save();
  return post;
}
export async function postExists(id) {
  const exists = await Post.findByPk(id);
  return exists ? 1 : 0;
}
export async function getPostById(id) {
  const exists = await postExists(id);

  if (!exists) {
    const error = new Error("Post Does not exist");
    error.statusCode = 404;
    throw error;
  }

  const post = await Post.findOne({
    where: { id },
    include: [users],
  });
  return post;
}

export async function deletePost(postId, userId) {
  const post = await getPostById(postId);

  if (post.userId !== Number(userId)) {
    const error = new Error("You are not authorised to delete this post");
    error.statusCode = 403;
    throw error;
  }
  await post.destroy();
  return post;
}

export async function getallPosts() {
  const postDetails = await Post.findAll({
    include: [
      { model: users, attributes: ["id", "name"] },
      { model: Comment, attributes: ["id", "content"] },
    ],
  });
  if (!postDetails) {
    const error = new Error("There are no posts at the moment");
    error.statusCode = 404;
    throw Error;
  }
  return postDetails;
}

export function getCommentCount(post) {
  return post.Comments.length;
}

export async function getPostsDetails() {
  const postDetails = await Post.findAll({
    attributes: ["id", "title"],
    include: [
      { model: users, attributes: ["id", "name"] },
      { model: Comment, attributes: ["id", "content"] },
    ],
  });
  if (!postDetails || postDetails.length === 0) {
    const error = new Error("There are no posts at the moment");
    error.statusCode = 404;
    throw error;
  }
  const postDetailsWithComments = postDetails.map((post) => {
    const posts = post.toJSON();
    2;
    return {
      ...posts,
      commentcount: getCommentCount(posts),
    };
  });

  return postDetailsWithComments;
}
