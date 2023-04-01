const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const validator = require('../controllers/validator')


router.get("/",(req,res)=>{
    res.render('pages/home');
})

router.post("/registration", authController.register)

router.post("/login", authController.login)

router.get("/logout", authController.logout)

router.post("/forgot_password", authController.forgotPasswordPost);

router.get("/forgot_password", (req, res) => {
    const input = validator.genInputDataJSON();
  
    res.render("pages/forgot_password", {
      user: req.user,
      input: input,
      popup: req.popup,
    });
});

router.get("/reset_password", authController.resetPasswordGet);
router.post("/reset_password", authController.resetPasswordPost);
  


module.exports = router;