const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')


router.get("/",(req,res)=>{
    res.render('pages/home');
})

router.post("/registration", authController.register)


module.exports = router;