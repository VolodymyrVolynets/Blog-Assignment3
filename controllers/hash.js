const bcrypt = require('bcrypt')

async function hash(toHash) {
    const hashed = await bcrypt.hash(toHash, 10)
    return hashed
}

async function check(password, hashed) {
    return await bcrypt.compare(password, hashed)
}

module.exports = { hash, check }