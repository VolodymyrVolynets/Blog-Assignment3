const express = require("express");
const router = express.Router();
const dbUsers = require("../../controllers/db/dbUsers");
const validator = require("../../controllers/validator");
const hash = require("../../controllers/hash");

router.get("/", async (req, res) => {
  res.render("./pages/admin/users", {
    user: req.user,
    users: await dbUsers.getAllUsers(),
  });
});

router.get("/toggle_is_admin", async (req, res) => {
  const { id } = req.query;
  if (await dbUsers.isAdminById(id)) {
    await dbUsers.removeAdminUserById(id);
  } else {
    await dbUsers.makeAdminUserById(id);
  }
  res.redirect("back");
});

router.get("/toggle_is_verified", async (req, res) => {
    const { id } = req.query;
    if (await dbUsers.isVerifiedById(id)) {
        await dbUsers.removeVerifiedUserById(id);
    } else {
        await dbUsers.makeVerifiedUserById(id);
    }
    res.redirect("back");
});

router.get("/remove", async (req, res) => {
  const { id } = req.query;
  await dbUsers.removeUserById(id);
  res.redirect("back");
});

router.get("/add_user", async (req, res) => {
  res.render("./pages/admin/add_user", {
    user: req.user,
  });
});

router.post("/add_user", async (req, res) => {
    var { username, password, email, name, isAdmin, isVerified } = req.body;
    if (typeof (isAdmin) === 'undefined') isAdmin = 0;
    if (typeof (isVerified) === 'undefined') isVerified = 0;
    try {
      await dbUsers.newUser(
          username,
          await hash.hash(password),
          name,
          email,
          isAdmin,
          isVerified
        );
        console.log("User added")
    res.render("./pages/admin/add_user", {
      user: req.user,
      popup: validator.genMessageDataJSON("User added successfully", false),
    });
  } catch (err) {
    res.render("./pages/admin/add_user", {
      user: req.user,
      popup: validator.genMessageDataJSON('Error', true),
    });
  }
});

module.exports = router;
