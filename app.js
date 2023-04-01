require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middleware/auth')
const popupMiddleware = require('./middleware/popup')

const app = express()
const port = process.env.PORT || 80
app.locals.moment = require('moment');

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(authMiddleware.checkIfLoggedIn);
app.use(popupMiddleware.checkIfPopup)

//Routers
app.use('/', require('./routes/views'))
app.use('/auth', require('./routes/auth'))
app.use('/mail', require('./routes/mail'))
app.use('/post', require('./routes/post'))
app.use('/admin', authMiddleware.checkIfAdmin, require('./routes/admin/admin'))


app.set('view engine', 'ejs')


var server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})