const express = require('express')
const router = express.Router()
const mailer = require('../controllers/mailer')
const userInput = require('../controllers/userData')
const db = require('../controllers/db')

router.get("/",(req,res)=>{
    res.render('pages/home');
})

router.post("/subscribeForUpdates", (req, res) => {
    const { email } = req.body

    if (userInput.isValidEmail(email)) {
        mailer.subscribeForUpdates(email)
        db.registerEmailSubscription(email)
    }

    res.redirect('/')
})


module.exports = router;