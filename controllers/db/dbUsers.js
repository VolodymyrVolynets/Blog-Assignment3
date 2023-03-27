const db = require('./db')

async function isUserExist(username) {
    const allUsersWithUsername = await db.executeMYSQL("SELECT * from users WHERE BINARY username = ?;", [username])
    // console.log(allUsersWithUsername.length >= 1)
    return allUsersWithUsername.length >= 1
}

async function getUser(username) {
    const user = (await db.executeMYSQL("SELECT * from users WHERE BINARY username = ?;", [username]))[0]
    return user
}

async function getAllUsers() {
    return db.executeMYSQL("SELECT * FROM users;")
}

async function newUser(username, hashedPass) {
    return db.executeMYSQL("INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)", [
        username,
        hashedPass,
        false
      ])
}

async function removeUserById(id) {
    await db.executeMYSQL("DELETE FROM users WHERE id = ?;", [id])
  }
  

async function makeAdminUserById(id) {
    await db.executeMYSQL("UPDATE users SET isAdmin = 1 WHERE id = ?;", [id])
}

async function removeAdminUserById(id) {
    await db.executeMYSQL("UPDATE users SET isAdmin = 0 WHERE id = ?;", [id])
}

async function isAdminById(id) {
    const user = (await db.executeMYSQL("SELECT * FROM users WHERE id = ?", [id]))[0]
    return user.isAdmin == 1
}

module.exports = {
    isUserExist,
    getUser,
    newUser,
    getAllUsers,
    makeAdminUserById,
    removeAdminUserById,
    isAdminById,
    removeUserById
}