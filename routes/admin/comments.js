const express = require("express");
const router = express.Router();
const contentManager = require("../../controllers/db/dbContentManager");


router.get("/", async (req, res) => {
    res.render('pages/admin/comments', {
        user: req.user,
        comments: await contentManager.getAllComments()
    })
});

router.get("/remove", async (req, res) => {
    const { id } = req.query
    await contentManager.removeCommentById(id)
    res.redirect('back')
});

module.exports = router;
