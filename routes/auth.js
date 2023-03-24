const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')


router.get("/",(req,res)=>{
    res.render('pages/home');
})

router.post("/registration", authController.register)

router.post("/login", authController.login)

router.post('/email', authController.email)

router.get("/logout", authController.logout)


module.exports = router;