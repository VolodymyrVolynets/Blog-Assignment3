const express = require('express')
const router = express.Router()
const userData = require('../controllers/userData')
const contentManager = require('../controllers/contentManager')
const validation = require('../controllers/userData')

router.get("/", async (req, res) => {
    const message = userData.genMessageDataJSON()
    const input = userData.genInputDataJSON()

    res.render('pages/home', {
        user: req.user,
        message: message,
        input: input,
        carousel: contentManager.getLatestCarosel(),
        posts:  await contentManager.getPosts()
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

router.get('/post', async (req, res) => {
    const id = req.query.id

    if (validation.isNumeric(id)) {

        const post = await contentManager.getPostById(id)
        
        res.render('pages/post', {
            user: req.user,
            post: post
        })
    } else {
        res.redirect('/')
    }
})

router.get("/blog", async (req, res) => {

    res.render('pages/blog', {
        user: req.user,
        posts:  await contentManager.getPosts()
        })

})


module.exports = router;