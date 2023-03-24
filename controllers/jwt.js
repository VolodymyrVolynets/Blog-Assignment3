const jwt = require('jsonwebtoken');

function generateAccessToken(data) {
    return jwt.sign(data, process.env.JWT_TOKEN, { expiresIn: '1h' });
}

function checkToken(token) {
    var payload
    try {
        payload = jwt.verify(token, process.env.JWT_TOKEN)
    } catch (err) {

    }
    return payload
}

module.exports = { generateAccessToken, checkToken }