const jwt = require("./jwt");
const usersDB = require("./db/dbUsers");
const hash = require("./hash");
const validator = require("./validator");


exports.register = async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  //Check for valid input
  const inputData = validator.genInputDataJSON(username);
  if (password != confirmPassword) {
    return res.render("pages/registration", {
      user: req.user,
      message: validator.genMessageDataJSON("Passwords do not match"),
      input: inputData,
    });
  } else if (
    !validator.isValidInput(password) ||
    !validator.isValidInput(username)
  ) {
    return res.render("pages/registration", {
      user: req.user,
      message: validator.genMessageDataJSON("Password and username should contains digits or lettes and 5-16 symbols length"),
      input: inputData,
    });
  }

  //if inputs valid check if user already exist
  try {
    if (await usersDB.isUserExist(username)) {
      return res.render("pages/registration", {
        user: req.user,
        message: validator.genMessageDataJSON("Username already taken"),
        input: inputData,
      });
    } else {
      //if user not exist create new user and redirect to a home page
      const hashedPass = await hash.hash(password);
      await usersDB.newUser(username, hashedPass)

      //generate JWT Token
      const token = jwt.generateAccessToken({ username: username });
      res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
      return res.redirect("/");
    }
  } catch (err) {
    //if error with db
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
