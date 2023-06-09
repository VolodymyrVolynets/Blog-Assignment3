const express = require("express");
const router = express.Router();
const validator = require("../controllers/validator");
const contentManager = require("../controllers/db/dbContentManager");

router.get("/", async (req, res) => {
  const message = validator.genMessageDataJSON();
  const input = validator.genInputDataJSON();

  res.render("pages/home", {
    user: req.user,
    message: message,
    input: input,
    posts: await contentManager.getLast10Posts(),
    popup: req.popup,
  });
});

router.get("/registration", (req, res) => {
  const message = validator.genMessageDataJSON(
    "Password and username should contains digits or lettes and 5-16 symbols length",
    false
  );
  const input = validator.genInputDataJSON();

  res.render("pages/registration", {
    user: req.user,
    message: message,
    input: input,
    popup: req.popup,
  });
});

router.get("/login", (req, res) => {
  const input = validator.genInputDataJSON(username=req.cookies.username);

  res.render("pages/login", {
    user: req.user,
    input: input,
    popup: req.popup,
  });
});

router.get("/blog", async (req, res) => {
  res.render("pages/blog", {
    user: req.user,
    posts: await contentManager.getPosts(),
    popup: req.popup,
  });
});

router.get("/about", async (req, res) => {
  res.render("pages/about", {
    user: req.user,
    popup: req.popup,
  });
});

module.exports = router;
