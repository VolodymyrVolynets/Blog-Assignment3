const express = require("express");
const router = express.Router();
const mailer = require("../controllers/mailer");
const validator = require("../controllers/validator");
const mailDB = require("../controllers/db/dbMails");
const jwt = require("../controllers/jwt");
const usersDB = require("../controllers/db/dbUsers");

router.post("/subscribe_for_updates", (req, res) => {
  const { email } = req.body;

  if (validator.isValidEmail(email)) {
    mailDB.registerEmailSubscription(email);
    mailer.subscribeForUpdates(email);
  }

  res.redirect("back");
});

router.get("/cancel", async (req, res) => {
  const { email } = req.query;

  if (validator.isValidEmail(email)) {
    await mailDB.removeEmailSuscription(email)
  }

  res.redirect("/");
});

router.get('/unsubscribe', async (req, res) => {
  const { email } = req.query;

  if (validator.isValidEmail(email)) {
    await mailDB.removeEmailSuscription(email)
  }

  res.redirect("/");
})

router.get("/verify", (req, res) => {
  const { token } = req.query;

  const payload = jwt.checkToken(token);
  if (payload === null) {
    res.redirect("/");
    return;
  }

  const { email } = payload;

  usersDB.verifyUserByEmail(email);

  res.redirect("/");
});

// router.get("/test", async (req, res) => {
//   const htmlPath = path.join(__dirname, "../views/emails/subscription.ejs")

//   const emailTemplate = fs.readFileSync(htmlPath, 'utf8');
//   const compiledEmailTemplate = ejs.compile(emailTemplate);
//   const html = compiledEmailTemplate({ link: req.get('host') });

  

//   res.send(html);
// });

module.exports = router;
