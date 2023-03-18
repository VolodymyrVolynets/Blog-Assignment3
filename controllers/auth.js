const jwt = require('./jwt')
const db = require('./db')
const hash = require('./hash')


exports.register = async (req, res) => {
    const { username, password, confirmPassword } = req.body

    //Check for valid input
    if (password != confirmPassword) {
        return res.render('pages/registration', {
            message: 'Passwords do not match', 
            user: { username: username } 
        })
    } else if (!isValidInput(password) || !isValidInput(username)) {
        return res.render('pages/registration', {
            message: 'Password and username should contains digits or lettes and 5-16 symbols length', 
            user: { username: username } 
        })
    }

    //if inputs valid check if user already exist
    try {
        const allUsersWithUsername = await db.executeMYSQL("SELECT * from users WHERE username = ?", [username])
        if (allUsersWithUsername.length >= 1) {
            return res.render('pages/registration', {
                message: 'Username already taken', 
                user: { username: username } 
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
        console.log(err)
        res.render('pages/registration'), {
            message: 'Unknown Error',
            user: {
                username: username
            }
        }
    }
}

function isValidInput(input) {
    const regex = new RegExp("^[a-zA-Z0-9]{5,16}$");
    const isValid = regex.test(input);
    return isValid;
}