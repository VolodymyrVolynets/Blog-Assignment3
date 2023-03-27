const express = require("express");
const router = express.Router();
const contentManager = require("../controllers/db/dbContentManager");
const validation = require("../controllers/validator");
const dbUsers = require("../controllers/db/dbUsers");

router.get("/", async (req, res) => {
    res.render('./pages/admin', {
        user: req.user
    })
});

router.get("/users", async (req, res) => {
    res.render('./pages/admin_users', {
        user: req.user,
        users: await dbUsers.getAllUsers()
    })
});

router.get("/toogleadmin", async (req, res) => {
    const { id } = req.query
    if (await dbUsers.isAdminById(id)) {
        await dbUsers.removeAdminUserById(id)
    } else {
        await dbUsers.makeAdminUserById(id)
    }
    res.redirect('back')
});

router.get("/comments", async (req, res) => {
    res.render('./pages/admin_comments', {
        user: req.user,
        comments: await contentManager.getAllComments()
    })
});

router.get("/removecomment", async (req, res) => {
    const { id } = req.query
    await contentManager.removeCommentById(id)
    res.redirect('back')
});



module.exports = router;
