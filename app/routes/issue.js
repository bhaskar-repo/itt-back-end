const issueController = require('../controllers/issueController');
const issueControllerHlpr = require('../controllers/issueControllerHlpr');
const appConfig = require('../../config/appConfig');
const auth = require('../middlewares/auth');

let setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}/issues`;

    app.post(`${baseUrl}/upload`, auth.isAuthorized, issueController.uploadFileCloud);
    app.get(`${baseUrl}/load`, auth.isAuthorized, issueController.loadData);
    /**
     * @apiGroup Issues
     * @apiVersion 1.0.0
     * @api {post} /api/v1/issues/create api for to create new issue
     * @apiParam {string} title title of the issue (body Param) required
     * @apiParam {string} description description of the issue (body param) required
     * @apiParam {string} comments comments on the issue optional
     * @apiParam {string} reporter reporterName person who is reporting the issue (body param) required
     * @apiParam {string} reporterUserId userId of the reporter
     * @apiParam {string} assignee userId of the assignee (body param) required
     * @apiParam {string} assigneeName assigneeName of the issue 
     * @apiParam {string} status status of the issue (body param required)
     * @apiParam {string} priority priority of the issue (body param) required
     * @apiParam {string[]} watchers watchers of the issue 
     * @apiParam {string} createdBy userId to track who created the issue
     * @apiParam {string} moduleName moduleName of the issue (body param) required
     * @apiParam {string} fileName fileName of the issue optional
     * @apiParam {string} fileLocation fileLocation of the issue optional
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * @apiSuccessExample {object} Success-Response
     * {
            "error": false,
            "message": "New issue created",
            "status": 200,
            "data": {
                "filesData": {
                    "issueId": "iv-rkXXfL",
                    "fileId": "aI-2-8YqiL",
                    "fileName": "",
                    "fileLocation": "",
                    "moduleName": "MODULE1",
                    "createdBy": "QwVh2a3z_",
                    "createdOn": "2019-05-29T03:55:19.000Z",
                    "lastUpdatedOn": "2019-05-29T03:55:19.000Z"
                },
                "issueData": {
                    "newIssue": {
                        "issueId": "iv-rkXXfL",
                        "title": "new1",
                        "description": "zdfdfdc",
                        "comments": "",
                        "reporter": "Bhaskar",
                        "assignee": "QwVh2a3z_",
                        "createdBy": "QwVh2a3z_",
                        "createdOn": "2019-05-29T03:55:19.000Z",
                        "lastUpdateBy": "QwVh2a3z_",
                        "lastUpdatedOn": "2019-05-29T03:55:19.000Z",
                        "reporterUserId": "QwVh2a3z_",
                        "assigneeName": "Bhaskar",
                        "status": "in-test",
                        "priority": "Important",
                    }
                }
            }
        }
     */
    app.post(`${baseUrl}/create`, auth.isAuthorized, issueController.createNewIssue);
    /**
     * @apiGroup Issues
     * @apiVersion 1.0.0
     * @api {get} /api/v1/issues/all api to get all issues
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * @apiSuccessExample {object} Success-Response
     * {
            "error": false,
            "message": "issue found",
            "status": 200,
            "data": [
                {
                    "issueId": "pgH5TtXRU",
                    "title": "NEWISSUE",
                    "reporter": "bhaskar pawar",
                    "createdOn": "2019-05-20T02:22:33.000Z",
                    "status": "in-test"
                },
                {
                    "issueId": "ct2tJ2SZ1",
                    "title": "dfgdfg",
                    "reporter": "bhaskar pawar",
                    "createdOn": "2019-05-20T06:15:13.000Z",
                    "status": "in-test"
                },
                {
                    "issueId": "iv-rkXXfL",
                    "title": "new1",
                    "reporter": "Bhaskar",
                    "createdOn": "2019-05-29T03:55:19.000Z",
                    "status": "in-test"
                }
            ]
        }
     */
    app.get(`${baseUrl}/all`, auth.isAuthorized, issueController.getAllIssues);
    /**
     * @apiGroup Issues
     * @apiVersion 1.0.0
     * @api {get} /api/v1/:issueId/:userId/edit api to get single issue
     * @apiParam {string} issueId issueId of the issue (request param) required
     * @apiParam {string} userId userId of logged in user (request param) required
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * @apiSuccessExample {object} Success-Response
     * {
        "error": false,
        "message": "issue fetched",
        "status": 200,
        "data": {
            "issueId": "iv-rkXXfL",
            "title": "new1",
            "description": "zdfdfdc",
            "comments": "",
            "reporter": "Bhaskar",
            "assignee": "QwVh2a3z_",
            "createdOn": "2019-05-29T03:55:19.000Z",
            "status": "in-test",
            "priority": "Important",
            "fileId": "aI-2-8YqiL",
            "moduleName": "MODULE2",
            "fileName": null,
            "fileLocation": null,
            "isWatch": true,
            "watchers": [
                {
                    "userId": "QwVh2a3z_",
                    "userName": "Bhaskar"
                },
                {
                    "userId": "QwVh2a3z_",
                    "userName": "Bhaskar"
                }
            ]
        }
    }
     */
    app.get(`${baseUrl}/:issueId/:userId/edit`, auth.isAuthorized, issueController.getSingleIssue);
    /**
     * @apiGroup Issues
     * @apiVersion 1.0.0
     * @api {put} /api/v1/issues/:issueId/edit api for to update existing issue
     * @apiParam {string} title title of the issue (body Param) required
     * @apiParam {string} description description of the issue (body param) required
     * @apiParam {string} comments comments on the issue optional
     * @apiParam {string} reporter reporterName person who is reporting the issue (body param) required
     * @apiParam {string} reporterUserId userId of the reporter
     * @apiParam {string} assignee userId of the assignee (body param) required
     * @apiParam {string} assigneeName assigneeName of the issue 
     * @apiParam {string} status status of the issue (body param required)
     * @apiParam {string} priority priority of the issue (body param) required
     * @apiParam {string[]} watchers watchers of the issue 
     * @apiParam {string} createdBy userId to track who created the issue
     * @apiParam {string} moduleName moduleName of the issue (body param) required
     * @apiParam {string} fileName fileName of the issue optional
     * @apiParam {string} fileLocation fileLocation of the issue optional
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * @apiSuccessExample {object} Success-Response
     * {
        "error": false,
        "message": "issue updated successfully !",
        "status": 200,
        "data": {
            "issueId": "iv-rkXXfL"
        }
     }
     * */
    app.put(`${baseUrl}/:issueId/edit`, auth.isAuthorized, issueController.updateIssue);
    app.get(`${baseUrl}/:userId/all`, auth.isAuthorized, issueControllerHlpr.getAllIssuesByUser);
}

module.exports = {
    setRouter: setRouter
}