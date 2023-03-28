const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    res.render('./pages/admin/main', {
        user: req.user
    })
});

router.use('/users', require('./users'))
router.use('/comments', require('./comments'))
router.use('/posts', require('./posts'))



module.exports = router;
