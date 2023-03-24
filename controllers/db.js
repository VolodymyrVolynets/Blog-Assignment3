const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME
})


async function executeMYSQL(query, params) {
    const [result] = await pool.execute(query, params)
    return result
}

async function registerEmailSubscription(email) {
    if (!isEmailSubscriptionExist) {
        executeMYSQL("INSERT INTO email_subscribed (email) VALUES (?);", [email])
    }
}

async function isEmailSubscriptionExist(email) {
    const emails = await executeMYSQL("SELECT * from email_subscribed WHERE BINARY email = ?;", [email])
    return emails.length >= 1
}

async function isUserExist(username) {
    const allUsersWithUsername = await executeMYSQL("SELECT * from users WHERE BINARY username = ?;", [username])
    // console.log(allUsersWithUsername.length >= 1)
    return allUsersWithUsername.length >= 1
}

async function getUser(username) {
    const user = (await executeMYSQL("SELECT * from users WHERE BINARY username = ?;", [username]))[0]
    return user
}

module.exports = { pool, executeMYSQL, registerEmailSubscription, isUserExist, getUser }