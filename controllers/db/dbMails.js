const db = require('./db')


async function isEmailSubscriptionExist(email) {
    const emails = await db.executeMYSQL("SELECT * from email_subscribed WHERE BINARY email = ?;", [email])
    return emails.length >= 1
}

async function registerEmailSubscription(email) {
    if (!isEmailSubscriptionExist(email)) {
        db.executeMYSQL("INSERT INTO email_subscribed (email) VALUES (?);", [email])
    }
}

module.exports = {
    registerEmailSubscription,
    isEmailSubscriptionExist
}