const db = require('./db')


async function isEmailSubscriptionExist(email) {
    const emails = await db.executeMYSQL("SELECT * from email_subscribed WHERE BINARY email = ?;", [email])
    return emails.length >= 1
}

async function registerEmailSubscription(email) {
    if (!await isEmailSubscriptionExist(email)) {
        db.executeMYSQL("INSERT INTO email_subscribed (email) VALUES (?);", [email])
    }
}

async function removeEmailSuscription(email) {
    await db.executeMYSQL("DELETE FROM email_subscribed WHERE email = ?;", [email])
}

async function getAllEmails() {
    return await db.executeMYSQL("SELECT * FROM email_subscribed;")
}

module.exports = {
    registerEmailSubscription,
    isEmailSubscriptionExist,
    getAllEmails,
    removeEmailSuscription
}