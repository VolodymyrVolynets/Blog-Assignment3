require('dotenv').config()
const express = require('express')
var path = require('path');
const app = express()
const port = process.env.PORT || 80

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('pages/home');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})