const nodemailer = require("nodemailer")
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

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
  const html = compiledEmailTemplate();

    await transporter.sendMail({
        from: '"Assignment3 Volodymyr Volynets" <assignment3volodymyrvolynets@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Subscribe for updates", // Subject line
        text: "You Successfuly subscribed", // plain text body
        html: html
    })
}

exports.newPostNotification = async (email, title) => {
  const htmlPath = path.join(__dirname, "../views/emails/new_post.ejs")
  const emailTemplate = fs.readFileSync(htmlPath, 'utf8');
  const compiledEmailTemplate = ejs.compile(emailTemplate);
  const html = compiledEmailTemplate({ title: title});

  await transporter.sendMail({
    from: '"Assignment3 Volodymyr Volynets" <assignment3volodymyrvolynets@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Check our blog, we have new post", // Subject line
    text: "New post", // plain text body
    html: html
})
}
