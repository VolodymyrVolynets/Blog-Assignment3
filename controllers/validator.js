function genUserDataJSON(isLoggedIn = false, isAdmin = false, username = '') {
    return {
            username: username,
            isLoggedIn: isLoggedIn,
            isAdmin: isAdmin
    }
}

function genMessageDataJSON(text = '', isError = true) {
    return {
            text: text,
            isError: isError
    }
}

function genInputDataJSON(username = '') {
    return {
            username: username
    }
}


function isValidInput(input) {
    const regex = new RegExp("^[a-zA-Z0-9]{5,16}$")
    const isValid = regex.test(input)
    return isValid
}

function isValidEmail(email) {
    const regex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
    const isValid = regex.test(email)
    return isValid
}

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

function isValidText(text) {
    return /^[A-Za-z0-9\s.,;]*$/.test(text)
}



module.exports = { genUserDataJSON, genMessageDataJSON, genInputDataJSON, isValidInput, isValidEmail, isNumeric, isValidText }