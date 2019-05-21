/**importing modules required by this library */
const logger = require('pino')();
const moment = require('moment');

/**
 * @description This method returns error information to track issues 
 * @author Bhaskar Pawar
 * @param {String} errorMessage 
 * @param {String} errorOrigin 
 * @param {Number} errorLevel 
 * @returns error Information
 */
let captureError = (errorMessage, errorOrigin, errorLevel) => {
    let currentTime = moment();
    let errorResponse = {
        timeStamp: currentTime,
        errorMessage: errorMessage,
        errorOrigin: errorOrigin,
        errorLevel: errorLevel
    }
    logger.error(errorResponse);
    return errorResponse;
} //end of captureError

/** 
 * @description This method returns information about successful transaction 
 * @author Bhaskar Pawar
 * @param {String} message
 * @param {String} origin
 * @param {Number} importance
 * @returns success information
*/
let captureInfo = (message, origin, importance) => {
    let currentTime = moment();
    let infoMessage = {
        timeStamp: currentTime,
        message: message,
        origin: origin,
        level: importance
    }
    logger.info(infoMessage);
    return infoMessage;
} //end of captureInfo

/**make it accessible to other modules in application */
module.exports = {
    error: captureError,
    info: captureInfo
}