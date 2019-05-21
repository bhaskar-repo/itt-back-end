const appConfig = require('../../config/appConfig');
const userController = require('../controllers/userController');
/**
 * This method is used to define routes for this module
 * @author Bhaskar Pawar
 * @param {*} app 
 */
const setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}/users`;
    app.post(`${baseUrl}/login`, userController.login);
    app.post(`${baseUrl}/signup`, userController.signUp);
    app.post(`${baseUrl}/logout`, userController.logout);
    app.post(`${baseUrl}/reset`, userController.resetPassword);
    app.get(`${baseUrl}/reset`, userController.checkUserExistence);
}/// end of set router

module.exports = {
    setRouter: setRouter
}