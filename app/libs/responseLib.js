/**
 * @description This method is to prettify the response being sent.
 * @author Bhaskar Pawar
 * @param {Boolean} error 
 * @param {String} mesasge 
 * @param {Number} status 
 * @param {*} data 
 * @returns prettified response
 */
let generateResponse = (error, message, status, data) => {
    let response = {
        error: error,
        message: message,
        status: status,
        data: data
    }
    return response;
}//end of generateResponse

/**
 * @author Bhaskar Pawar
 * @param {*} obj 
 * @returns object without fields mentioned
 */
let returnFilteredObj = (obj) => {
    delete obj.password;
    delete obj._id;
    delete obj.__v;
    delete obj.createdOn;
    return obj;
}// end of returnFiltredObj

module.exports = {
    generateResponse: generateResponse,
    returnFilteredObj: returnFilteredObj
}