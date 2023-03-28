const express = require("express");
const router = express.Router();
const contentManager = require("../../controllers/db/dbContentManager");

router.get("/", async (req, res) => {
    res.render('pages/admin/posts', {
        user: req.user,
        posts: await contentManager.getAllPosts()
    })
});

router.get("/remove", async (req, res) => {
    const { id } = req.query
    await contentManager.removePostById(id)
    res.redirect('back')
});

router.get("/new", async (req, res) => {
    res.render('pages/admin/post_new', {
        user: req.user
    })
});

router.post("/new", async (req, res) => {
    const { date, title, author, description, imgURL } = req.body
    await contentManager.addPost(date, title, author, description, imgURL)
    res.redirect('/admin/posts')
});

router.get("/edit", async (req, res) => {
    const { id } = req.query
    res.render('pages/admin/post_edit', {
        user: req.user,
        post: await contentManager.getPostById(id)
    })
});

router.post('/edit', async (req, res) => {
    const { date, title, author, description, imgURL, id } = req.body

    await contentManager.updatePost(date, title, author, description, imgURL, id)
    res.redirect('back')
})

module.exports = router;
