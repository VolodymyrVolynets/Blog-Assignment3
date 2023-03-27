const mysql = require('mysql2/promise')
const moment = require('moment')

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



module.exports = { pool, executeMYSQL }