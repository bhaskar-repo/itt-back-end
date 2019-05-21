/**
 * @description This is to validate email pattern
 * @author Bhaskar Pawar
 * @param {String} email
 * @returns boolean isMatch
 */
let validateEmail = (email) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return false;
  } else {
    return true;
  }
}// end of Email

/**
 * @description Minimum 8 characters which contain only characters,numeric digits, underscore and first character must be a letter
 * @author Bhaskar Pawar
 * @param {String} password 
 * @returns boolean is criteria matched or not
 */
let validatePassword = (password) => {
  if (/^[A-Za-z0-9]\w{7,}$/.test(password)) {
    return false;
  } else {
    return true;
  }
}//end of Password

module.exports = {
  validateEmail: validateEmail,
  validatePassword: validatePassword
}
