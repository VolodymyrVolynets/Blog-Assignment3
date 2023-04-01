const db = require('./db')

async function isUserExist(username) {
    const allUsersWithUsername = await db.executeMYSQL("SELECT * from users WHERE BINARY username = ?;", [username])
    return allUsersWithUsername.length >= 1
}

async function isUserIdExistById(userId) {
    const allUsersWithId = await db.executeMYSQL("SELECT * from users WHERE id = ?;", [userId])
    return allUsersWithId.length >= 1
  }
  

async function isEmailExist(email) {
    const allUsersWithEmail = await db.executeMYSQL(
      "SELECT * from users WHERE BINARY email = ?;",
      [email]
    );
    return allUsersWithEmail.length >= 1;
}
  
async function getUser(username) {
    const user = (await db.executeMYSQL("SELECT * from users WHERE BINARY username = ?;", [username]))[0]
    return user
}

async function getAllUsers() {
    return db.executeMYSQL("SELECT * FROM users;")
}

async function isVerifiedById(id) {
    const user = (await db.executeMYSQL("SELECT * FROM users WHERE id = ?", [id]))[0]
    return user["is_verified"] === 1
}

async function makeVerifiedUserById(id) {
  await db.executeMYSQL("UPDATE users SET is_verified = 1 WHERE id = ?;", [id])
}

async function newUser(username, hashedPass, name, email, isAdmin = false, is_verified = false) {
    return db.executeMYSQL(
      "INSERT INTO users (username, password, isAdmin, name, email, is_verified) VALUES (?, ?, ?, ?, ?, ?)",
      [username, hashedPass, isAdmin, name, email, is_verified]
    );
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

async function verifyUserByEmail(email) {
    await db.executeMYSQL("UPDATE users SET is_verified = 1 WHERE email = ?;", [email])
}

async function isAdminById(id) {
    try {
      if (!isUserIdExistById(id)) return false;
      const user = (await db.executeMYSQL("SELECT * FROM users WHERE id = ?", [id]))[0];
      return user["isAdmin"] === 1;
    } catch (err) {
      return false;
    }
  }
  

async function isAdminByUsername(username) {
    try {
        const user = (await db.executeMYSQL("SELECT * FROM users WHERE username = ?", [username]))[0]
      return user["isAdmin"] === 1
    } catch (err) {
      return false
    }
}

async function getEmailByUsername(username) {
    const user = (await db.executeMYSQL("SELECT * FROM users WHERE username = ?", [username]))[0]
    return user["email"]
}

async function isVerifiedByUsername(username) {
  try {
    const user = (await db.executeMYSQL("SELECT * FROM users WHERE username = ?", [username]))[0]
    return user["is_verified"] === 1
  } catch (err) {
    return false
  }
}

async function removeVerifiedUserById(id) {
    await db.executeMYSQL("UPDATE users SET is_verified = 0 WHERE id = ?;", [id])
}

async function updatePassword(username, password) {
    await db.executeMYSQL("UPDATE users SET password = ? WHERE username = ?;", [password, username])
}

async function getUsernameByEmail(email) {
  const user = (await db.executeMYSQL("SELECT * from users WHERE BINARY email = ?;", [email]))[0]
  return user["username"]
}

module.exports = {
    isUserExist,
    getUser,
    newUser,
    getAllUsers,
    makeAdminUserById,
    removeAdminUserById,
    isAdminById,
    removeUserById,
    isAdminByUsername,
    isEmailExist,
    isUserIdExistById,
    verifyUserByEmail,
    isVerifiedByUsername,
  updatePassword,
  getUsernameByEmail,
  isVerifiedById,
  makeVerifiedUserById,
  removeVerifiedUserById,
  getEmailByUsername
}