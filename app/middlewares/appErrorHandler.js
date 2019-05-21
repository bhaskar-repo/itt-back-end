/**modules required */
const response = require('../libs/responseLib');
const logger = require('../libs/loggerLib');

/**
 * to handle unauthorized access
 * @author Bhaskar Pawar
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
let errorHandler = (err, req, res, next) => {
    logger.error('error occured', 'appErrorHandler:errorHandler()', 1);
    let apiResponse = response.generateResponse(true, 'error occured at global level', 500, null);
    res.send(apiResponse);
}// end request ip logger function 

/**
 * route that does not exist in the application
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
let notFoundHandler = (req, res, next) => {
    logger.info('Route not found in the application', 'appErrorHandler:notFoundHandler()', 1);
    let apiResponse = response.generateResponse(true, 'Route not found in the application', 404, null);
    res.status(404).send(apiResponse);

}// end not found handler

module.exports = {
    globalErrorHandler: errorHandler,
    globalNotFoundHandler: notFoundHandler
}
