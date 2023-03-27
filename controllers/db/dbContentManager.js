const db = require("./db");
const moment = require("moment");

function getLatestCarosel() {
  return [
    {
      url: "./img/hogwards.jpg",
      title: "Hogwards Legacy",
      releaseDate: "February 10, 2023",
    },
    {
      url: "./img/atomicHeart.jpg",
      title: "Atomic Heart",
      releaseDate: "February 21, 2023",
    },
    {
      url: "./img/forrest.jpg",
      title: "Son Of The Forest",
      releaseDate: "February 10, 2023",
    },
    {
      url: "./img/hogwards.jpg",
      title: "Hogwards Legacy",
      releaseDate: "February 23, 2023",
    },
  ];
}

async function getPosts() {
  const result = await db.executeMYSQL("SELECT * FROM posts;");
  return result;
}

async function getLast3Posts() {
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

async function getCommentsForPost(postId) {
  const comments = (await db.executeMYSQL("SELECT comments.date, comments.comment, users.username FROM comments INNER JOIN posts ON comments.post_id = posts.id INNER JOIN users ON comments.user_id = users.id WHERE posts.id = ?;", [postId]))
  return comments
}

async function newComment(postId, username, comment) {
  const userId = (await db.executeMYSQL('SELECT id FROM users WHERE users.username = ?;', [username]))[0]['id']
  console.log(postId)
  console.log(userId)
  console.log(comment)
  console.log(moment().format('YYYY-MM-DD'))
  return await db.executeMYSQL("INSERT INTO comments (date, comment, post_id, user_id) VALUES (?, ?, ?, ?);", [moment().format('YYYY-MM-DD'), comment, postId, userId])
}

async function getAllComments() {
  return await db.executeMYSQL("SELECT * FROM comments;")
}

async function removeCommentById(id) {
  await db.executeMYSQL("DELETE FROM comments WHERE id = ?;", [id])
}


module.exports = {
  getLatestCarosel,
  getPosts,
  getPostById,
  getLast3Posts,
  getCommentsForPost,
  newComment,
  getAllComments,
  removeCommentById
};
