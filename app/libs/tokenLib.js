/** to generate user token upon logging in */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const logger = require('../libs/loggerLib');
const checkLib = require('../libs/checkLib');

/**
 * @author Bhaskar Pawar
 * @param {*} data 
 * @param {*} cb 
 */
let generateToken = (data, cb) => {

  try {
    let claims = {
      jwtid: shortid.generate(),
      iat: Date.now(),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
      sub: 'authToken',
      iss: 'issueTrackingTool',
      data: data
    }
    let tokenDetails = {
      token: jwt.sign(claims, data.secretKey),
      tokenSecret: data.secretKey
    }
    logger.info('Token generated', 'tokenLib:generateToken()', 1);
    cb(null, tokenDetails);
  } catch (err) {
    cb(err, '' , null);
    logger.error('Token generation failed', 'tokenLib:generateToken()', 1);
  }
}// end generate token 

/**
 * This is to verify claim upon logging in
 * @author Bhaskar Pawar
 * @param {String} token 
 * @param {String} secretKey 
 * @param {*} cb 
 */
let verifyClaim = (token, secretKey, cb) => {
  // verify a token symmetric
  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) {
      logger.error('Error while verifying claim', 'tokenLib:verifyClaim()', 1);
      cb(err, null);
    }
    else {
      logger.info('claim verificaion successful', 'tokenLib:verifyClaim()', 1);
      cb(null, decoded);
    }
  });

}// end verify claim 


module.exports = {
  generateToken: generateToken,
  verifyToken: verifyClaim
}
