require('dotenv').config()
const express = require('express')
const mysql = require('mysql')
var path = require('path');
const app = express()
const port = process.env.PORT || 80

app.use(express.static('public'))

//Routers
app.use(require('./views'))
app.use(require('./auth'))

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