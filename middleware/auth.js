const jwt = require("../controllers/jwt");
const validator = require("../controllers/validator");
const userDB = require('../controllers/db/dbUsers')

exports.checkIfLoggedIn = async (req, res, next) => {
  //check if token is undefined
  if (req.cookies["token"] === undefined) {
    req.user = validator.genUserDataJSON(false, false, "");
    next();
    return;
  }

  const token = req.cookies["token"];
  const payload = jwt.checkToken(token);
  if (payload === null) {
    req.user = validator.genUserDataJSON(false, false, "");
    next();
    return;
  }

  const username = payload["username"];
  const isUserExist = await userDB.isUserExist(username);
  const isAdmin = await userDB.isAdminByUsername(username);

  try {
    req.user = validator.genUserDataJSON(isUserExist, isAdmin, username);
  } catch (err) {
    req.user = validator.genUserDataJSON(false, false, "");
  }

  next();
};

exports.checkIfAdmin = async (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.redirect("/");
  }
};
