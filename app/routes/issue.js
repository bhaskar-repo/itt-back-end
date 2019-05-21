const issueController = require('../controllers/issueController');
const issueControllerHlpr = require('../controllers/issueControllerHlpr');
const appConfig = require('../../config/appConfig');
const auth = require('../middlewares/auth');

let setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}/issues`;

    app.post(`${baseUrl}/upload`, auth.isAuthorized, issueController.uploadFileCloud);
    app.get(`${baseUrl}/load`, auth.isAuthorized, issueController.loadData);
    app.post(`${baseUrl}/create`, auth.isAuthorized, issueController.createNewIssue);
    app.get(`${baseUrl}/all`, auth.isAuthorized, issueController.getAllIssues);
    app.get(`${baseUrl}/:issueId/:userId/edit`, auth.isAuthorized, issueController.getSingleIssue);
    app.put(`${baseUrl}/:issueId/edit`, auth.isAuthorized, issueController.updateIssue);
    app.get(`${baseUrl}/:userId/all`, auth.isAuthorized, issueControllerHlpr.getAllIssuesByUser);
}

module.exports = {
    setRouter: setRouter
}