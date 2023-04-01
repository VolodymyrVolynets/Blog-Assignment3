const db = require("./db");
const moment = require("moment");

async function getPosts() {
  const result = await db.executeMYSQL("SELECT * FROM posts ORDER BY id DESC;");
  return result;
}

async function getLast10Posts() {
  const result = await db.executeMYSQL(
    "SELECT * FROM posts ORDER BY id DESC LIMIT 10;"
  );
  return result;
}

async function getPostById(id) {
  const result = (
    await db.executeMYSQL("SELECT * FROM posts WHERE id = ?;", [id])
  )[0];
  return result;
}

async function getPostTitleById(id) {
  const result = (
    await db.executeMYSQL("SELECT title FROM posts WHERE id = ?;", [id])
  )[0];
  return result.title;
}

async function getCommentsForPost(postId) {
  const comments = (await db.executeMYSQL("SELECT comments.date, comments.comment, users.username FROM comments INNER JOIN posts ON comments.postId = posts.id INNER JOIN users ON comments.userId = users.id WHERE posts.id = ?;", [postId]))
  return comments
}

async function newComment(postId, username, comment) {
  const userId = (await db.executeMYSQL('SELECT id FROM users WHERE users.username = ?;', [username]))[0]['id'] 
  return await db.executeMYSQL("INSERT INTO comments (date, comment, postId, userId) VALUES (?, ?, ?, ?);", [moment().format('YYYY-MM-DD'), comment, postId, userId])
}

async function getAllComments() {
  return await db.executeMYSQL("SELECT comments.*, users.username FROM comments INNER JOIN users ON comments.userId = users.id;")
}

async function removeCommentById(id) {
  await db.executeMYSQL("DELETE FROM comments WHERE id = ?;", [id])
}

async function getAllPosts() {
  return await db.executeMYSQL("SELECT * FROM posts;")
}

async function removePostById(id) {
  await db.executeMYSQL("DELETE FROM posts WHERE id = ?;", [id])
}

async function updatePost(date, title, author, description, imgURL, id) {
  await db.executeMYSQL("UPDATE posts SET date = ?, title = ?, author = ?, description = ?, imgURL = ? WHERE id = ?;", [date, title, author, description, imgURL, id])
}

async function addPost(date, title, author, description, imgURL) {
  await db.executeMYSQL("INSERT INTO posts (date, title, author, description, imgURL) VALUES (?, ?, ?, ?, ?);", [date, title, author, description, imgURL])
}

async function getPostId(date, title, author, description, imgURL) {
  try {
    const [rows] = await db.executeMYSQL(
      "SELECT id FROM posts WHERE date=? AND title=? AND author=? AND description=? AND imgURL=?",
      [date, title, author, description, imgURL]
    );
    return rows.id;
  } catch (error) {
    return null;
  }
}



module.exports = {
  getPosts,
  getPostById,
  getLast10Posts,
  getCommentsForPost,
  newComment,
  getAllComments,
  removeCommentById,
  removePostById,
  getAllPosts,
  updatePost,
  addPost,
  getPostId,
  getPostTitleById
};
