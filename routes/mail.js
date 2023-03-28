const express = require("express");
const router = express.Router();
const mailer = require("../controllers/mailer");
const validator = require("../controllers/validator");
const mailDB = require("../controllers/db/dbMails");

router.get("/", (req, res) => {
  res.render("pages/home");
});

router.post("/subscribe_for_updates", (req, res) => {
  const { email } = req.body;

  if (validator.isValidEmail(email)) {
    mailDB.registerEmailSubscription(email);
    mailer.subscribeForUpdates(email);
  }

  res.redirect("back");
});

module.exports = router;
