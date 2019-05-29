const appConfig = require('../../config/appConfig');
const userController = require('../controllers/userController');
/**
 * This method is used to define routes for this module
 * @author Bhaskar Pawar
 * @param {*} app 
 */
const setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}/users`;

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api for user login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "login successful",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IldpbmRtMkJWeiIsImlhdCI6MTU1OTA5ODM5MzI3OCwiZXhwIjoxNTU5MTg0NzkzLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJpc3N1ZVRyYWNraW5nVG9vbCIsImRhdGEiOnsidXNlcklkIjoiY1pKdjlGbVgxIiwiZmlyc3ROYW1lIjoiYmhhc2thciIsImxhc3ROYW1lIjoicGF3YXIiLCJ1c2VyTmFtZSI6ImJoYXNrYXIgcGF3YXIiLCJlbWFpbCI6ImJoYXNrYXJAMTIzLmNvbSIsIm1vYmlsZU51bWJlciI6NDU2NDQ0NTY0Niwicm9sZUlkIjoxLCJzZWNyZXRLZXkiOiJUaGlzSXNNeUFwcGxpY2F0aW9uc1JhbmRvbVN0cmluZ1NvVGhhdG5vYm9keWd1ZXNzZXMifX0.FYV8D3xngMVjKqCI8Yf46xuetN-KBqi3HPij1Oh6-w0",
                "userDetails": {
                    "userId": "cZJv9FmX1",
                    "firstName": "bhaskar",
                    "lastName": "pawar",
                    "userName": "bhaskar pawar",
                    "email": "bhaskar@123.com",
                    "mobileNumber": 4564445646,
                    "roleId": 1
                }
            }
        }
    */
    app.post(`${baseUrl}/login`, userController.login);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup api for user signup.
     *
     * @apiParam {string} firstName of the user. (body params) (required)
     * @apiParam {string} lastName of the user. (body params) (required)
     * @apiParam {string} mobileNumber of the user. (body params) (required)
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} roleId of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "User created",
            "status": 200,
            "data": {
                        "userId": "QwVh2a3z_",
                        "firstName": "Bhaskar",
                        "lastName": "Pawar",
                        "email": "bhaskar@1.com",
                        "roleId": 1,
                        "createdOn": "2019-05-29T03:00:55.000Z"
                    }
        }
    */
    app.post(`${baseUrl}/signup`, userController.signUp);

    /**
     * @apiGroup users
     * @apiVersion 1.0.0
     * @api {post} /api/v1/users/logout api for user logout
     * @apiParam {string} userId unique Id of the user. (body param) required
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * @apiSuccessExample {object} Success-Response
     * {
         "error": false,
         "message": "Logged Out Successfully",
         "status": 200,
         "data": null
        }
     */
    app.post(`${baseUrl}/logout`, userController.logout);

    /**
     * @apiGroup users
     * @apiVersion 1.0.0
     * @api {post} /api/v1/users/reset api for user reset password
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * @apiSuccessExample {object} Success-Response
     * {
            "error": false,
            "message": "password reset successful !",
            "status": 200,
            "data": {
                    "userId": "QwVh2a3z_",
                    "email": "bhaskar@1.com"
                    }
        }
     */
    app.post(`${baseUrl}/reset`, userController.resetPassword);
    app.get(`${baseUrl}/reset`, userController.checkUserExistence);
}/// end of set router

module.exports = {
    setRouter: setRouter
}