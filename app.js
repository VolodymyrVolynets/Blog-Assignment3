require('dotenv').config()
const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth')

const app = express()
const port = process.env.PORT || 80

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(auth.checkUser);

//Routers
app.use('/', require('./routes/views'))
app.use('/auth', require('./routes/auth'))
app.use('/mail', require('./routes/mail'))


app.set('view engine', 'ejs')


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})