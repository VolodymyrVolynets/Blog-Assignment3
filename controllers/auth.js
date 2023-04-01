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

      // Generate JWT Token
      const token = jwt.generateAccessToken({ username });
      res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
      mailer.verifyEmail(email, username)
      return res.redirect("/");
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
    const isVerified = usersDB.isVerifiedByUsername(username)
    if (!isVerified) {
      return res.render("pages/login", {
        user: req.user,
        message: validator.genMessageDataJSON("Email not verified", true),
        input: inputData,
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
