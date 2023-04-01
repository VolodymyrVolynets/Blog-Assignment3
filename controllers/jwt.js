const jwt = require('jsonwebtoken');

function generateAccessToken(data, expireIn = '24h') {
    return jwt.sign(data, process.env.JWT_TOKEN, { expiresIn: expireIn });
}

function checkToken(token) {
    var payload
    try {
        payload = jwt.verify(token, process.env.JWT_TOKEN)
    } catch (err) {
        return null
    }
    return payload
}

module.exports = { generateAccessToken, checkToken }