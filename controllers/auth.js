const jwt = require("./jwt");
const usersDB = require("./db/dbUsers");
const hash = require("./hash");
const validator = require("./validator");
const mailer = require('./mailer')


exports.register = async (req, res) => {
  const { username, password, confirmPassword, name, email } = req.body;

  // Check for valid input
  const inputData = validator.genInputDataJSON(username, name, email);
  if (password !== confirmPassword) {
    return res.render("pages/registration", {
      user: req.user,
      message: validator.genMessageDataJSON("Passwords do not match"),
      input: inputData,
    });
  } else if (
    !validator.isValidInput(password) ||
    !validator.isValidInput(username) ||
    !validator.isValidName(name) ||
    !validator.isValidEmail(email)
  ) {
    return res.render("pages/registration", {
      user: req.user,
      message: validator.genMessageDataJSON("Invalid input"),
      input: inputData,
    });
  }

  // Check if user already exists
  try {
    if (await usersDB.isUserExist(username)) {
      return res.render("pages/registration", {
        user: req.user,
        message: validator.genMessageDataJSON("Username already taken"),
        input: inputData,
      });
    } else if (await usersDB.isEmailExist(email)) {
      return res.render("pages/registration", {
        user: req.user,
        message: validator.genMessageDataJSON("Email already in use"),
        input: inputData,
      });
    } else {
      // Create new user and redirect to home page
      const hashedPass = await hash.hash(password);
      await usersDB.newUser(username, hashedPass, name, email);

      // // Generate JWT Token
      // const token = jwt.generateAccessToken({ username });
      // res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
      res.cookie('username', username, { maxAge: 3600000, httpOnly: true })
      res.cookie('popup', {text: "You Need to verify your email", isError: false}, { maxAge: 3600000, httpOnly: true })
      mailer.verifyEmail(email, username)
      return res.redirect("/login");
    }
  } catch (err) {
    // If error with db
    return res.render("pages/registration", {
      user: req.user,
      message: validator.genMessageDataJSON("Unknown Error"),
      input: inputData,
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (typeof(username) === 'undefined') {
    username = req.cookies.username
  }
  const inputData = validator.genInputDataJSON(username);

  //Check for valid input
  if (!validator.isValidInput(password) || !validator.isValidInput(username)) {
    return res.render("pages/login", {
      user: req.user,
      message: validator.genMessageDataJSON("Invalid password or username"),
      input: inputData,
    });
  }

  //if inputs valid check if user already exist
  try {

    res.cookie('username', username, { maxAge: 3600000, httpOnly: true })
    if (!(await usersDB.isUserExist(username))) {
      return res.render("pages/login", {
        user: req.user,
        message: validator.genMessageDataJSON("User do not exist"),
        input: inputData,
      });
    }

    //if user exist try to login
    const user = await usersDB.getUser(username);
    const isCorrectPassword = await hash.check(password, user.password);
    const isVerified = await usersDB.isVerifiedByUsername(username)
   
    if (!isVerified) {
      const email = await usersDB.getEmailByUsername(username)
      mailer.verifyEmail(email, username)
      return res.render("pages/login", {
        user: req.user,
        message: validator.genMessageDataJSON("Email not verified", true),
        input: inputData,
        popup: {text: "Verification email was sent!", isError: false}
      });
    }
    //if password incorect try again
    if (!isCorrectPassword) {
      return res.render("pages/login", {
        user: req.user,
        message: validator.genMessageDataJSON("Wrong password", true),
        input: inputData,
      });
    }

    //generate JWT Token
    const token = jwt.generateAccessToken({
      username: username,
      isAdmin: user.isAdmin,
    });

    res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
    return res.redirect("/");
  } catch (err) {
    //if error with db
    return res.render("pages/login", {
      user: req.user,
      message: validator.genMessageDataJSON("Unknown Error", true),
      input: inputData,
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("back");
};

exports.forgotPasswordPost = async (req, res) => {
  const { email } = req.body;
  const inputData = validator.genInputDataJSON("", "", email);
  if (!validator.isValidEmail(email)) {
    return res.render("pages/forgot_password", {
      user: req.user,
      popup: {text: "Invalid email", isError: true},
      input: inputData,
    });
  }
  try {
    if (!(await usersDB.isEmailExist(email))) {
      return res.render("pages/forgot_password", {
        user: req.user,
        popup: {text: "Email not found", isError: true},
        input: inputData,
      });
    }
    const username = await usersDB.getUsernameByEmail(email);
    const token = jwt.generateAccessToken({ username: username });

    mailer.resetPassword(email, token);
    res.cookie('popup', {text: "Email sent", isError: false}, { maxAge: 3600000, httpOnly: true })
    return res.redirect("/login");
  } catch (err) {
    return res.render("pages/forgot_password", {
      user: req.user,
      popup: {text: "Unknown Error", isError: true},
      input: inputData,
    });
  }
}

exports.resetPasswordGet = async (req, res) => {
  const { token } = req.query;
  const { username } = jwt.checkToken(token);
  if (!username) {
    res.cookie('popup', {text: "Invalid token", isError: true}, { maxAge: 3600000, httpOnly: true })
    return res.redirect("/login");
  }

  res.render("pages/reset_password", {
    user: req.user,
    token: token,
  });
}

exports.resetPasswordPost = async (req, res) => {
  const { password, confirmationPassword, token } = req.body;
  const { username } = jwt.checkToken(token);

  if (!validator.isValidInput(password) || !validator.isValidInput(confirmationPassword)) {
    return res.render("pages/reset_password", {
      user: req.user,
      popup: validator.genMessageDataJSON("Invalid input"),
      token: token,
    });
  }

  if (password !== confirmationPassword) {
    return res.render("pages/reset_password", {
      user: req.user,
      popup: validator.genMessageDataJSON("Passwords do not match"),
      token: token,
    });
  }

  try {
    const hashedPass = await hash.hash(password);
    await usersDB.updatePassword(username, hashedPass);
    res.cookie('popup', {text: "Password changed", isError: false}, { maxAge: 3600000, httpOnly: true })
    return res.redirect("/login");
  } catch (err) {
    return res.render("pages/reset_password", {
      user: req.user,
      popup: validator.genMessageDataJSON("Unknown Error"),
      token: token,
    });
  }
}