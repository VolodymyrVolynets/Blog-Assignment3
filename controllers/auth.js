const mysql = require('mysql')

const connection = mysql.createConnection({
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME
})

// TODO - Manage users input
// TODO - check for existing usernames

exports.register = (req, res) => {
    const { username, password, confirmPassword } = req.body

    if (password == "") {
        res.render('pages/registration',{
            message: 'Incorrect Password',
            user: {
                username: username
            }
        })
    } else if (password != confirmPassword) {
        res.render('pages/registration',{
            message: 'Passwords do not match',
            user: {
                username: username
            }
        })
    }

    connection.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], function (err, result) {
        if (err) {
            res.render('pages/registration',{
                message: 'Error in DataBase',
                user: {
                    username: username
                }
            })
        } else {
            res.render('pages/registration')
        }
    })
}