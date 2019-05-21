/**
 * importing required modules
 */
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* Custom Library */
let logger = require('../libs/loggerLib');

/**
 * @description password encryption method
 * @author Bhaskar Pawar
 * @param {String} myPlaintextPassword
 * @returns encrypted password
 */
let hashpassword = (myPlaintextPassword) => {
  let salt = bcrypt.genSaltSync(saltRounds);
  let hash = bcrypt.hashSync(myPlaintextPassword, salt);
  return hash;
}//end hashpassword

/**
 * @description Compares DB password with entered one
 * @author Bhaskar Pawar
 * @param {String} oldPassword 
 * @param {String} hashpassword 
 * @param {*} cb
 */
let comparePassword = (oldPassword, hashpassword, cb) => {
  bcrypt.compare(oldPassword, hashpassword, (err, res) => {
    if (err) {
      logger.error(err.message, 'generatePasswordLib:comparePassword()', 1);
      cb(err, null);
    } else {
      logger.info('password matched', 'generatePasswordLib:comparePassword()', 1);
      cb(null, res);
    }
  })
}// end of comparePassword


let comparePasswordSync = (myPlaintextPassword, hash) => {
  return bcrypt.compareSync(myPlaintextPassword, hash);
}// end of comparePasswordSync

module.exports = {
  hashpassword: hashpassword,
  comparePassword: comparePassword,
  comparePasswordSync: comparePasswordSync
}
