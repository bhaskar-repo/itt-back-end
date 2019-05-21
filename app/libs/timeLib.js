/* Importing required modules */
const moment = require('moment');
const momenttz = require('moment-timezone');
const timeZone = 'Asia/Calcutta';
/**fetch current time
 * @author Bhaskar Pawar
 * @returns current time
 */
let now = () => {
  return moment.utc().format();
}//end of now

/** get the local time
 * @author Bhaskar Pawar
 * @returns current local time
 */
let getLocalTime = () => {
  return moment().tz(timeZone).format();
}//end of getLocalTime

/**
 * convert local time to other time zone
 * @param {Date} time 
 * @returns converted timezone value
 */
let convertToLocalTime = (time) => {
  return momenttz.tz(time, timeZone).format('LLLL');
}//end of convertToLocalTime

module.exports = {
  now: now,
  getLocalTime: getLocalTime,
  convertToLocalTime: convertToLocalTime
}