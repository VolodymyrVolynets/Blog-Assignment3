const express = require('express')
const router = express.Router()
const userData = require('../controllers/userData')
const contentManager = require('../controllers/contentManager')

router.get("/",(req, res) => {
    const message = userData.genMessageDataJSON()
    const input = userData.genInputDataJSON()

    res.render('pages/home', {
        user: req.user,
        message: message,
        input: input,
        carousel: contentManager.getLatestCarosel(),
        posts:  contentManager.getPosts()
        })

})

router.get('/registration', (req, res) => {
    const message = userData.genMessageDataJSON('Password and username should contains digits or lettes and 5-16 symbols length', false)
    const input = userData.genInputDataJSON()
    
    res.render('pages/registration', {
        user: req.user,
        message: message,
        input: input
        })
})

router.get('/login', (req, res) => {
    const input = userData.genInputDataJSON()
    
    res.render('pages/login', {
        user: req.user,
        input: input
        })
})


module.exports = router;