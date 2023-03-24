const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
})

exports.subscribeForUpdates = async (email) => {
    await transporter.sendMail({
        from: '"Assignment3 Volodymyr Volynets" <assignment3volodymyrvolynets@outlook.com>', // sender address
        to: email, // list of receivers
        subject: "Subscribe for updates", // Subject line
        text: "You Successfuly subscribed", // plain text body
        html: "<b>You Successfuly subscribed</b>", // html body
    })
}

// exports.sendRegisterEmail = async (req, res) => {
//     const { email } = req.body

//     try {
//         await transporter.sendMail({
//             from: '"Assignment3 Volodymyr Volynets" <assignment3volodymyrvolynets@outlook.com>', // sender address
//             to: email, // list of receivers
//             subject: "Registration", // Subject line
//             text: "You Successfuly registered", // plain text body
//             html: "<b>You Successfuly registered</b>", // html body
//         })
//         res.redirect('/')
//     } catch (err) {
//         res.send("Error")
//     }
// }
