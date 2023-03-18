require('dotenv').config()
const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser');

const app = express()
const port = process.env.PORT || 80

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Routers
app.use('/', require('./routes/views'))
app.use('/auth', require('./routes/auth'))


app.set('view engine', 'ejs')

const connection = mysql.createConnection({
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME
})

connection.connect( (error) => {
  if (error) {
    console.log(error)
  } else {
    console.log("MySQL started...")
  }
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})