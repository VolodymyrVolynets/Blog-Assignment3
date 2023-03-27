const express = require("express");
const router = express.Router();
const contentManager = require("../controllers/db/dbContentManager");
const validation = require("../controllers/validator");
const db = require("../controllers/db/db");

router.post("/", async (req, res) => {
  const { id, text } = req.body;

  if (validation.isNumeric(id) && validation.isValidText(text)) {

    await contentManager.newComment(id, req.user["username"], text);
  }

  res.redirect("./");
});

router.get("/", async (req, res) => {
  const id = req.query.id;

  if (validation.isNumeric(id)) {
    const post = await contentManager.getPostById(id);

    res.render("pages/post", {
      user: req.user,
      post: post,
      comments: await contentManager.getCommentsForPost(id),
    });
  } else {
    res.redirect("back");
  }
});

module.exports = router;
