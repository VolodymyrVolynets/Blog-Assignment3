const nodemailer = require("nodemailer")
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const jwt = require('./jwt');
const contentManager = require('./db/dbContentManager');

// const transporter = nodemailer.createTransport({
//   host: "smtp.office365.com",
//   port: 587,
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// })

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
})

exports.subscribeForUpdates = async (email) => {
  const htmlPath = path.join(__dirname, "../views/emails/subscription.ejs")
  const emailTemplate = fs.readFileSync(htmlPath, 'utf8');
  const compiledEmailTemplate = ejs.compile(emailTemplate);
  const html = compiledEmailTemplate({
    unsubscribeURL: `${process.env.URL}/mail/unsubscribe?email=${email}`
  
  });

    await transporter.sendMail({
        from: '"Assignment3 Volodymyr Volynets" <assignment3volodymyrvolynets@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Subscribe for updates", // Subject line
        text: "You Successfuly subscribed", // plain text body
        html: html
    })
}

{/* <h1>New Post!</h1>
        <h2><%-title%></h2>
        <h3>Click <a href="<%%-postURL%>">here</a> to read.</h3> */}

exports.newPostNotification = async (email, id) => {
  const htmlPath = path.join(__dirname, "../views/emails/new_post.ejs")
  const postTitle = await contentManager.getPostTitleById(id);
  const emailTemplate = fs.readFileSync(htmlPath, 'utf8');
  const compiledEmailTemplate = ejs.compile(emailTemplate);
  const html = compiledEmailTemplate(
    {
      title: postTitle,
      postURL: `${process.env.URL}/post?id=${id}`,
      unsubscribeURL: `${process.env.URL}/mail/unsubscribe?email=${email}`
  });

  await transporter.sendMail({
    from: '"Assignment3 Volodymyr Volynets" <assignment3volodymyrvolynets@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Check our blog, we have new post", // Subject line
    text: "New post", // plain text body
    html: html
})
}


exports.verifyEmail = async (email, username) => {
  const htmlPath = path.join(__dirname, "../views/emails/verification.ejs")
  const emailTemplate = fs.readFileSync(htmlPath, 'utf8');
  const compiledEmailTemplate = ejs.compile(emailTemplate);
  const verifyURL = `${process.env.URL}/mail/verify?token=${jwt.generateAccessToken({email: email}, '365d')}`
  const html = compiledEmailTemplate({ username: username, verifyURL: verifyURL });

  await transporter.sendMail({
    from: '"Assignment3 Volodymyr Volynets" <assignment3volodymyrvolynets@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Verify Your Email Address", // Subject line
    text: "Verify Email Address", // plain text body
    html: html
})
}

exports.resetPassword = async (email, token) => {
  const htmlPath = path.join(__dirname, "../views/emails/reset_password.ejs")
  const emailTemplate = fs.readFileSync(htmlPath, 'utf8');
  const compiledEmailTemplate = ejs.compile(emailTemplate);
  const resetURL = `${process.env.URL}/auth/reset_password?token=${token}`
  const html = compiledEmailTemplate({ resetURL: resetURL });

  await transporter.sendMail({
    from: '"Assignment3 Volodymyr Volynets" <assignment3volodymyrvolynets@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Reset Password", // Subject line
    text: "Reset Password", // plain text body
    html: html
})
}