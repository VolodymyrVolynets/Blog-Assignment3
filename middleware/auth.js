const jwt = require('../controllers/jwt')
const userDetails = require('../controllers/userData')


exports.checkUser = async (req, res, next) => {
    const token = req.cookies['token']
    const payload = jwt.checkToken(token)

    try {
        req.user = userDetails.genUserDataJSON(true, payload['isAdmin'], payload['username'])
    } catch (err) {
        req.user = userDetails.genUserDataJSON(false, false, '')
    }

    next()
}