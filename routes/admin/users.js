const express = require("express");
const router = express.Router();
const dbUsers = require("../../controllers/db/dbUsers");

router.get("/", async (req, res) => {
    res.render('./pages/admin/users', {
        user: req.user,
        users: await dbUsers.getAllUsers()
    })
});

router.get("/toggle_is_admin", async (req, res) => {
    const { id } = req.query
    if (await dbUsers.isAdminById(id)) {
        await dbUsers.removeAdminUserById(id)
    } else {
        await dbUsers.makeAdminUserById(id)
    }
    res.redirect('back')
});

router.get("/remove", async (req, res) => {
    const { id } = req.query
    await dbUsers.removeUserById(id)
    res.redirect('back')
});


module.exports = router;
