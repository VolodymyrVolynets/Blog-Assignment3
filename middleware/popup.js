const jwt = require("../controllers/jwt");
const validator = require("../controllers/validator");
const userDB = require('../controllers/db/dbUsers')

exports.checkIfPopup = async (req, res, next) => {
    if (req.cookies["popup"] === undefined) {
        req.popup = validator.genMessageDataJSON();
        next();
        return;
    }

    const popup = req.cookies["popup"];
    res.cookie("popup", "", { maxAge: 0 });

    try {
        req.popup = validator.genMessageDataJSON(popup.text, popup.isError);
    } catch (err) {
        req.popup = validator.genMessageDataJSON();
    }

    next();
};
