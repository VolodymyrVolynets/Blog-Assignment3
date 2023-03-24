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
        const allUsersWithUsername = await db.executeMYSQL("SELECT * from users WHERE BINARY username = ?", [username])
        if (allUsersWithUsername.length >= 1) {
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
        const allUsersWithUsername = await db.executeMYSQL("SELECT * from users WHERE BINARY username = ?", [username])
        if (allUsersWithUsername.length < 1) {
            const errorMessage = userData.genMessageDataJSON('User do not exist', true)
            return res.render('pages/login', {
                user: req.user,
                message: errorMessage,
                input: inputData
            })
        }

        //if user exist try to login
        console.log(allUsersWithUsername[0]['password'])
        const isCorrectPassword = await hash.check(password, allUsersWithUsername[0]['password'])

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
        const token = jwt.generateAccessToken({username: username})
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

exports.email = async (req, res) => {
    const { email } = req.body

    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
      
    transporter.sendMail({
      from: '"Volodymyr Volynets" <assignment3volodymyrvolynets@outlook.com>', // sender address
      to: email, // list of receivers
      subject: "Assignment 3 Volodymyr Volynets", // Subject line
      text: "You Successfuly subscribed", // plain text body
      html: "<b>You Successfuly subscribed</b>", // html body
    }).then(info => {
      console.log({info})
    }).catch(console.error)
  
}
exports.logout = (req, res) => {
    res.clearCookie("token")
    res.redirect('/')
}