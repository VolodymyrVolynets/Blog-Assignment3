const jwt = require('./jwt')
const db = require('./db')
const hash = require('./hash')
const userData = require('./userData')


// TODO - fix username

exports.register = async (req, res) => {
    const { username, password, confirmPassword } = req.body

    //Check for valid input
    const inputData = userData.genInputDataJSON(username)
    if (password != confirmPassword) {
        const errorMessage = userData.genMessageDataJSON('Passwords do not match', true)
        return res.render('pages/registration', {
            user: req.user,
            message: errorMessage,
            input: inputData
        })
    } else if (!userData.isValidInput(password) || !userData.isValidInput(username)) {
        const errorMessage = userData.genMessageDataJSON('Password and username should contains digits or lettes and 5-16 symbols length', true)
        return res.render('pages/registration', {
            user: req.user,
            message: errorMessage,
            input: inputData
        })
    }

    //if inputs valid check if user already exist
    try {
        if (await db.isUserExist(username)) {
            const errorMessage = userData.genMessageDataJSON('Username already taken', true)
            return res.render('pages/registration', {
                user: req.user,
                message: errorMessage,
                input: inputData
            })
        } else {
            //if user not exist create new user and redirect to a home page
            const hashedPass = await hash.hash(password)
            db.executeMYSQL("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPass])
            
            //generate JWT Token
            const token = jwt.generateAccessToken({username: username})
            res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
            return res.redirect('/')
        }
    } catch (err) {
        //if error with db
        const errorMessage = userData.genMessageDataJSON('Unknown Error', true)
        return res.render('pages/registration', {
            user: req.user,
            message: errorMessage,
            input: inputData
        })
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body
    const inputData = userData.genInputDataJSON(username)

    //Check for valid input
    if (!userData.isValidInput(password) || !userData.isValidInput(username)) {
        const errorMessage = userData.genMessageDataJSON('Invalid password or username', true)
        return res.render('pages/login', {
            user: req.user,
            message: errorMessage,
            input: inputData
        })
    }

    //if inputs valid check if user already exist
    try {
        if (!await db.isUserExist(username)) {
            const errorMessage = userData.genMessageDataJSON('User do not exist', true)
            return res.render('pages/login', {
                user: req.user,
                message: errorMessage,
                input: inputData
            })
        }

        //if user exist try to login
        const user = await db.getUser(username)
        const isCorrectPassword = await hash.check(password, user.password)

        //if password incorect try again
        if (!isCorrectPassword) {
            const errorMessage = userData.genMessageDataJSON('Wrong password', true)
            return res.render('pages/login', {
                user: req.user,
                message: errorMessage,
                input: inputData
            })
        }
        
        //generate JWT Token
        const token = jwt.generateAccessToken({username: username, isAdmin: user.isAdmin})
        res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
        return res.redirect('/')
        
    } catch (err) {
        //if error with db
        const errorMessage = userData.genMessageDataJSON('Unknown Error', true)
        return res.render('pages/login', {
            user: req.user,
            message: errorMessage,
            input: inputData
        })
    }
}

exports.logout = (req, res) => {
    res.clearCookie("token")
    res.redirect('/')
}