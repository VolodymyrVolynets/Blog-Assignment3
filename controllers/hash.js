const bcrypt = require('bcrypt')

async function hash(toHash) {
    const hashed = await bcrypt.hash(toHash, 10)
    return hashed
}

module.exports = { hash }