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
    const regex = new RegExp("^[a-zA-Z0-9]{5,16}$");
    const isValid = regex.test(input);
    return isValid;
}


module.exports = { genUserDataJSON, genMessageDataJSON, genInputDataJSON, isValidInput }