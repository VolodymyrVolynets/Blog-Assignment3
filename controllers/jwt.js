const jwt = require('jsonwebtoken');

function generateAccessToken(data) {
    return jwt.sign(data, process.env.JWT_TOKEN, { expiresIn: '1h' });
}

module.exports = { generateAccessToken }