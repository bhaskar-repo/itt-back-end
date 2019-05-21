const mongoose = require('mongoose');
const logger = require('../libs/loggerLib');
const shortId = require('shortid');
const checkLib = require('../libs/checkLib');
const responseLib = require('../libs/responseLib');

let UsersIssue = mongoose.model('UsersIssue');

/**
 * @description This will fecth all the issues matching to user
 * @author Bhaskar Pawar
 * @param {*} req 
 * @param {*} res 
 */
let getAllIssuesByUser = (req, res) => {
    fetchIssuesByUser = () => {
        return new Promise((resolve, reject) => {
            let query = UsersIssue.find({ userId: req.params.userId }, 'issueId').select('-_id');
            query.where('isWatch', true)
            query.exec((err, result) => {
                if (err) {
                    logger.error('error in getting users issues', 'IssueControllerHlpr:getAllIssuesByUser', 1);
                    let apiResponse = responseLib.generateResponse(true, 'could not fectch issues', 202, null);
                    reject(apiResponse);
                }
                else if (checkLib.isEmpty(result)) {
                    let apiResponse = responseLib.generateResponse(true, 'No Issues Found for this user', 201, null);
                    reject(apiResponse);
                }
                else {
                    resolve(result);
                }
            })
        })
    }

    fetchIssuesByUser(req, res).
        then((resolve) => {
            let apiResponse = responseLib.generateResponse(false, 'Issues Found this user', 200, resolve);
            res.send(apiResponse);
        }).catch((err) => {
            res.send(err);
        })
}//end of getAllIssues By User

let returnWatchers  = (issueId, cb) => {
    let query = UsersIssue.find({ issueId: issueId }, 'userId userName isWatch').select('-_id');
    query.where('isWatch', true)
    query.exec((err, result) => {
        if (err) {
            logger.error('error in getting users issues', 'IssueControllerHlpr:returnWatchers', 1);
            cb(err, null);
        }
        else if (checkLib.isEmpty(result)) {
            logger.info('no issues for this user found', 'IssueControllerHlpr:returnWatchers');
            cb(err, null);
        }
        else {
            cb(null, result);
        }
    })

}

/**
 * @description Will tell what are the users assciated with which issues
 * @author Bhaskar Pawar
 * @param {String} userId 
 * @param {String} issueId 
 */
let addUsersToIssuesList = (issueId, userId, userName, isWatch) => {
    console.log(userName);
    let newUsersIssue = new UsersIssue({
        id: shortId.generate(),
        issueId: issueId,
        userId: userId,
        userName: userName,
        isWatch: isWatch
    })
    newUsersIssue.save((err, details) => {
        if (err) {
            logger.error('User can not be added due internal server error', 'issueControllerHlpr: adddUsersToIssuesList', 1);
        }
        else {
            logger.info('Users details added', 'issueControllerHlpr: adddUsersToIssuesList', 1);
        }
    })
}//end of add Users to issues list

/**
 * @description This is to update the user when assigned to new user
 * @param {String} issueId 
 * @param {String} userId 
 */
let updateUsersToIssuesList = (issueId, userId, userName, isWatch) => {

    UsersIssue.findOne({ issueId: issueId ,userId: userId},(err, details) => {
        if (err) {
            logger.error('Updatation to issue list failed', 'issueControllerHlpr:updateUsersToIssueList', 1);
        }
        else if (checkLib.isEmpty(details)) {
            addUsersToIssuesList(issueId, userId, userName, isWatch);
            logger.error('list is empty', 'issueControllerHlpr:updateUsersToIssueList', 1);
        }
        else {
            details.isWatch = isWatch;
            details.userName = userName;
            details.save((err, details) => {
                if (err) {
                    logger.error('User can not be updated due internal server error', 'issueControllerHlpr: updateUsersToIssueList', 1);
                }
                else {
                    logger.info('updation successful', 'issueControllerHlpr:updateUsersToIssueList', 1);
                }
            })
           
        }
    })
}// end of update Users To Issues List

module.exports = {
    addUsersToIssuesList: addUsersToIssuesList,
    updateUsersToIssueList: updateUsersToIssuesList,
    getAllIssuesByUser: getAllIssuesByUser,
    returnWatchers: returnWatchers
}