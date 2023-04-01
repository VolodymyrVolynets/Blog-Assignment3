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

function genInputDataJSON(username = '', name = '', email = '' ) {
    return {
      username,
      name,
      email,
    };
  }


function isValidInput(input) {
    const regex = new RegExp("^[a-zA-Z0-9]{5,16}$")
    const isValid = regex.test(input)
    return isValid
}

function isValidName(name) {
    const regex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
    return regex.test(name);
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
    // Maximum length of text
    const maxLength = 1000;

    // Ensure text length is within the allowed range
    if (text.length < 1 || text.length > maxLength) {
        return false;
    }

    // Use a regular expression to allow only alphanumeric characters and basic punctuation
    const regex = new RegExp("^[a-zA-Z0-9,.!?;:()\\s]{1,1000}$");
    const isValid = regex.test(text);
    return isValid;
}


module.exports = {
    genUserDataJSON,
    genMessageDataJSON,
    genInputDataJSON,
    isValidInput,
    isValidEmail,
    isNumeric,
    isValidText,
    isValidName
}