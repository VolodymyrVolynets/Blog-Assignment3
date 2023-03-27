const jwt = require('../controllers/jwt')
const validator = require('../controllers/validator')


exports.checkUser = async (req, res, next) => {
    const token = req.cookies['token']
    const payload = jwt.checkToken(token)

    try {
        req.user = validator.genUserDataJSON(true, payload['isAdmin'], payload['username'])
    } catch (err) {
        req.user = validator.genUserDataJSON(false, false, '')
    }

    next()
}