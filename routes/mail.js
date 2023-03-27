const express = require("express");
const router = express.Router();
const mailer = require("../controllers/mailer");
const validator = require("../controllers/validator");
const mailDB = require("../controllers/db/dbMails");

router.get("/", (req, res) => {
  res.render("pages/home");
});

router.post("/subscribeForUpdates", (req, res) => {
  const { email } = req.body;

  if (validator.isValidEmail(email)) {
    mailer.subscribeForUpdates(email);
    mailDB.registerEmailSubscription(email);
  }

  res.redirect("back");
});

module.exports = router;
