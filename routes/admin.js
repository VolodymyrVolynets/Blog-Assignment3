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

router.get("/posts", async (req, res) => {
    res.render('./pages/admin_posts', {
        user: req.user,
        posts: await contentManager.getAllPosts()
    })
});

router.get("/removepost", async (req, res) => {
    const { id } = req.query
    await contentManager.removePostById(id)
    res.redirect('back')
});

router.get("/newpost", async (req, res) => {
    res.render('pages/admin_new_post', {
        user: req.user
    })
});

router.post("/newpost", async (req, res) => {
    const { date, title, author, description, imgURL } = req.body
    await contentManager.addPost(date, title, author, description, imgURL)
    res.redirect('../admin/posts')
});

router.get("/editpost", async (req, res) => {
    const { id } = req.query
    res.render('pages/admin_edit_post', {
        user: req.user,
        post: await contentManager.getPostById(id)
    })
});

router.post('/updatepost', async (req, res) => {
    const { date, title, author, description, imgURL, id } = req.body

    await contentManager.updatePost(date, title, author, description, imgURL, id)
    res.redirect('back')
})


module.exports = router;
