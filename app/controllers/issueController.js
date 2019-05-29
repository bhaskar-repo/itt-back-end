const mongoose = require('mongoose');
const shortid = require('shortid');
const checkLib = require('../libs/checkLib');
const responseLib = require('../libs/responseLib');
const time = require('../libs/timeLib');
const logger = require('../libs/loggerLib');
const issueControllerHlpr = require('../controllers/issueControllerHlpr');
const awsUpload = require('../libs/awsFileUpload');
const multer = require('multer');
const express = require('express');
const path = require('path');
var events = require('events');
var eventEmitter = new events.EventEmitter();

let IssueModel = mongoose.model('Issue');
let ModuleModel = mongoose.model('Module');
let UserModel = mongoose.model('User');
let UsersIssueModel = mongoose.model('UsersIssue');

singleUpload = awsUpload.single('file');

//this is the local storage to upload the files
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

let upload = multer({ storage: storage }).single('file');

/**
 * @author Bhaskar Pawar
 * @description This will upload the files to local storage
 * @param {*} req 
 * @param {*} res 
 */
let uploadFile = (req, res) => {

    uploadToLocal = () => {
        return new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if (err) {
                    reject(req);
                }
                else {
                    logger.info('File uploaded successFully', 'issueController:uploadFile()', 1);
                    resolve(req.file.originalname);
                }
            })
        })
    }//end of upload to local

    uploadToLocal(req, res)
        .then((fileName) => {
            let apiResponse = responseLib.generateResponse(false, 'File uploaded', 200, fileName);
            res.send(apiResponse);
        }).catch((err) => {
            res.send(err);
        })
}//end of upload file

/**
 * will upload file to amazon s3 bucket
 * @author Bhaskar Pawar
 * @param {*} req 
 * @param {*} res 
 */
let uploadFileCloud = (req, res) => {
    uploadToAWSS3 = () => {
        return new Promise((resolve, reject) => {
            singleUpload(req, res, (err) => {
                if (err) {
                    logger.error('AWS file upload failed', 'issueController:uploadFile()', 1);
                    let apiResponse = responseLib.generateResponse(true, 'Error in uploading file on aws', 202, null);
                    reject(apiResponse);
                }
                else {
                    logger.info('file uploaded to aws', 'issueController:uploadFile()', 1);
                    let response = {
                        fileName: req.file.originalname,
                        fileLocation: req.file.location
                    }
                    resolve(response);
                }
            })
        })
    }//end of upload to AWSS3

    uploadToAWSS3(req, res)
        .then((file) => {
            let apiResponse = responseLib.generateResponse(false, 'File uploaded', 200, file);
            res.send(apiResponse);
        }).catch((err) => {
            res.send(err);
        })
}// end of upload file cloud


/**
 * @description This returns all the issues
 * @author Bhaskar Pawar
 * @param {*} req 
 * @param {*} res 
 */
let getAllIssues = (req, res) => {

    findIssues = () => {
        return new Promise((resolve, reject) => {
            IssueModel.find({}, 'issueId status title reporter createdOn').select('-_id')
                .lean()
                .exec((err, issuDetails) => {
                    if (err) {
                        logger.error('Error in fetching issue information', 'IssueController:loadCreationData:getAllIssues()', 1);
                        let apiResponse = responseLib.generateResponse(true, 'Internal server error occured while fetching Issue information', 202, null);
                        reject(apiResponse);
                    }
                    else if (checkLib.isEmpty(issuDetails)) {
                        logger.error('No issues found', 'IssueController:loadCreationData:getAllIssues()', 1);
                        let apiResponse = responseLib.generateResponse(true, 'No issues found !', 201, null);
                        reject(apiResponse);
                    }
                    else {
                        logger.info('issues fetched', 'IssueController:findAssignees()', 1);
                        resolve(issuDetails);
                    }
                })
        })
    }//end of find issues

    findIssues(req, res)
        .then((resolve) => {
            let apiResponse = responseLib.generateResponse(false, 'issue found', 200, resolve);
            res.send(apiResponse);
        }).catch((err) => {
            res.send(err);
        })

}// end of get all issues

/**
 * @description This is to get single issue
 * @author Bhaskar Pawar
 * @param {*} req l
 * @param {*} res 
 */
let getSingleIssue = (req, res) => {
    fetchIssue = () => {
        return new Promise((resolve, reject) => {
            IssueModel.findOne({ issueId: req.params.issueId }, 'issueId title status createdOn assignee priority reporter description comments')
                .select('-_id')
                .lean()
                .exec((err, issueDetails) => {
                    if (err) {
                        logger.error('error in fetching issue details', 'IssueController:getSingleIssue:fetchIssues', 1);
                        let apiResponse = responseLib.generateResponse(true, 'could not fetch issue details', 202, null);
                        reject(apiResponse);
                    }
                    else if (checkLib.isEmpty(issueDetails)) {
                        logger.info('No issues found', 'IssueController:getSingleIssue:fetchIssues', 1);
                        let apiResponse = responseLib.generateResponse(true, 'No issues found', 201, null);
                        reject(apiResponse);
                    }
                    else {
                        resolve(issueDetails);
                    }
                })
        })
    }//end of fetch issues

    fetchFile = (issueDetails) => {
        return new Promise((resolve, reject) => {
            ModuleModel.findOne({ issueId: issueDetails.issueId }, 'moduleId fileId moduleName fileName fileLocation').select('-_id')
                .lean()
                .exec((err, fileDetails) => {
                    if (err) {
                        logger.error('error in fetching file details', 'IssueController:getSingleIssue:fetchFiles', 1);
                        let apiResponse = responseLib.generateResponse(true, 'could not fetch issue details', 202, null);
                        reject(apiResponse);
                    }
                    else if (checkLib.isEmpty(fileDetails)) {
                        logger.info('No files found', 'IssueController:getSingleIssue:fetchFiles', 1);
                        let apiResponse = responseLib.generateResponse(true, 'No files found', 201, null);
                        reject(apiResponse);
                    }
                    else {
                        issueDetails.fileId = fileDetails.fileId;
                        issueDetails.moduleName = fileDetails.moduleName;
                        issueDetails.fileName = fileDetails.fileName;
                        issueDetails.fileLocation = fileDetails.fileLocation;
                        resolve(issueDetails);
                    }
                })
        })
    }//end of fetchFiles

    fetchAssinee = (details) => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ userId: details.assignee }, 'userName', (err, userDetails) => {
                if (err) {
                    logger.error('error in fetching assignee details', 'IssueController:getSingleIssue:fetchAssinee', 1);
                    let apiResponse = responseLib.generateResponse(true, 'could not fetch issue details', 202, null);
                    reject(apiResponse);
                }
                else if (checkLib.isEmpty(userDetails)) {
                    logger.info('No Assignee found', 'IssueController:getSingleIssue:fetchAssinee', 1);
                    let apiResponse = responseLib.generateResponse(true, 'No Assignee found', 201, null);
                    reject(apiResponse);
                }
                else {
                    details.userName = userDetails.userName;
                    resolve(details);
                }
            })
        })
    }//end of fetch assignee

    fetchIsWatcher = (details) => {
        return new Promise((resolve, reject) => {
            let query = UsersIssueModel.findOne({ issueId: details.issueId }, 'isWatch');
            query.where('userId', req.params.userId)
            query.select('-_id').exec((err, result) => {
                if (err) {
                    logger.error('error in fetching is watcher or not', 'IssueController:getSingleIssue:fetchIsWatcher', 1);
                    let apiResponse = responseLib.generateResponse(true, 'error in fetching iswatch', 202, null);
                    reject(apiResponse);
                }
                else if (checkLib.isEmpty(result)) {
                    details.isWatch = false;
                    resolve(details);
                }
                else {
                    console.log(result.isWatch);
                    details.isWatch = result.isWatch;
                    resolve(details);
                }
            })
        })
    }

    fetchWatchersList = (details) => {

        return new Promise((resolve, reject) => {
            let query = UsersIssueModel.find({issueId: details.issueId}, 'userId userName');
            query.where('isWatch', true)
            query.select('-_id')
                .exec((err, result) => {
                    if (err) {
                        logger.error('error in fetching watchers', 'IssueController:getSingleIssue:fetchWatchersList', 1);
                        let apiResponse = responseLib.generateResponse(true, 'error in getting watchers list', 202, null);
                        reject(apiResponse);
                    }
                    else if (checkLib.isEmpty(result)) {
                        details.watchers = result;
                        resolve(details);
                    }
                    else {
                        details.watchers = result;
                        resolve(details);
                    }
                })
        })
    }

    fetchIssue(req, res)
        .then(fetchFile)
        .then(fetchAssinee)
        .then(fetchIsWatcher)
        .then(fetchWatchersList)
        .then((resolve) => {
            let apiResponse = responseLib.generateResponse(false, 'issue fetched', 200, resolve);
            res.send(apiResponse);
        }).catch((err) => {
            res.send(err);
        })
}

/**
 * @author Bhaskar Pawar
 * @description Save new issue data to the databaase
 * @param {*} req 
 * @param {*} res 
 */
let createNewIssue = (req, res) => {
    create = () => {
        return new Promise((resolve, reject) => {
            let newIssue = new IssueModel({
                issueId: shortid.generate(),
                title: req.body.title,
                description: req.body.description,
                comments: req.body.comments,
                reporter: req.body.reporter,
                reporterUserId: req.body.reporterUserId,
                assignee: req.body.assignee,
                assigneeName: req.body.assigneeName,
                status: req.body.status,
                priority: req.body.priority,
                watchers: req.body.watchers,
                createdBy: req.body.createdBy,
                createdOn: time.now(),
                lastUpdateBy: req.body.lastUpdateBy,
                lastUpdatedOn: time.now()
            })

            newIssue.save((err, newIssue) => {
                if (err) {
                    logger.error('error creating new issue', 'IssueController: CreateNewIssue()', 1);
                    let apiResponse = responseLib.generateResponse(true, 'issue creation error', 202, null);
                    reject(apiResponse);
                }
                else {
                    logger.info('new issue created', 'IssueController: CreateNewIssue()', 1);
                    let response = {
                        fileName: req.body.fileName,
                        fileLocation: req.body.fileLocation,
                        newIssue: newIssue
                    }
                    resolve(response);
                }
            })
        })
    }//end of create issue

    saveFileData = (response) => {
        return new Promise((resolve, reject) => {
            let fileData = new ModuleModel({
                issueId: response.newIssue.issueId,
                fileId: shortid.generate(),
                moduleName: req.body.moduleName,
                fileName: response.fileName,
                fileLocation: response.fileLocation,
                createdBy: req.body.createdBy,
                createdOn: time.now(),
                lastUpdateBy: req.body.lastUpdateBy,
                lastUpdatedOn: time.now()
            })

            fileData.save((err, responseData) => {
                if (err) {
                    logger.error('error creating new issue', 'IssueController: CreateNewIssue()', 1);
                    let apiResponse = responseLib.generateResponse(true, 'issue creation error', 202, null);
                    reject(apiResponse);
                }
                else {
                    logger.info('new issue created', 'IssueController: CreateNewIssue()', 1);
                    let responseBody = {
                        filesData: responseData,
                        issueData: response
                    }
                    resolve(responseBody);
                }
            })
        })
    }// end of ssave to module data

    create(req, res)
        .then(saveFileData)
        .then((resolve) => {
            let apiResponse = responseLib.generateResponse(false, 'New issue created', 200, resolve);
            eventEmitter.emit('saveUserIssues', resolve);
            res.send(apiResponse);
        }).catch((err) => {
            res.send(err);
        })

}//end of create new issue

/**
 * @author Bhaskar Pawar
 * @description This is to update the selected issue
 * @param {*} req 
 * @param {*} res 
 */
let updateIssue = (req, res) => {
    let data = req.body;
    updateIssueData = () => {
        return new Promise((resolve, reject) => {
            IssueModel.updateOne({ issueId: req.params.issueId }, data, (err, details) => {
                if (err) {
                    logger.error('error in updating the issue', 'issueController:updateNewIssue:updateIssuesData()', 1);
                    let apiResponse = responseLib.generateResponse(true, 'issue updation error', 202, null);
                    reject(apiResponse);
                }
                else if (checkLib.isEmpty(details)) {
                    logger.error('issue not found', 'issueController:updateNewIssue:updateIssuesData()', 1);
                    let apiResponse = responseLib.generateResponse(true, 'No issue found', 201, null);
                    reject(apiResponse);
                }
                else {
                    let fileData = {
                        fileName: req.body.fileName,
                        moduleName: req.body.moduleName,
                        fileLocation: req.body.fileLocation
                    }

                    details.fileData = fileData;
                    details.userId = data.oldAssignee;
                    details.issueId = req.params.issueId;
                    details.isWatch = req.body.isWatch;
                    details.assigneeName = req.body.assigneeName;
                    resolve(details);
                }
            })
        })
    }//end of update Issue Data

    updateFilesData = (details) => {
        return new Promise((resolve, reject) => {
            ModuleModel.updateOne({ issueId: req.params.issueId }, details.fileData, (err, fileDetails) => {
                if (err) {
                    logger.error('error in updating the file details', 'issueController:updateNewIssue:updateFilesData()', 1);
                    let apiResponse = responseLib.generateResponse(true, 'file details updation error', 202, null);
                    reject(apiResponse);
                }
                else if (checkLib.isEmpty(fileDetails)) {
                    logger.error('file not found', 'issueController:updateNewIssue:updateFilesData()', 1);
                    let apiResponse = responseLib.generateResponse(true, 'No file found', 201, null);
                    reject(apiResponse);
                }
                else {
                    fileDetails.userId = details.userId;
                    fileDetails.issueId = details.issueId;
                    fileDetails.isWatch = details.isWatch;
                    fileDetails.assigneeName = details.assigneeName;
                    resolve(fileDetails);
                }
            })
        })

    }//end of update Files Data

    updateIssueData(req, res)
        .then(updateFilesData)
        .then((resolve) => {
            let apiResponse = responseLib.generateResponse(false, 'issue updated successfully !', 200, resolve);
            eventEmitter.emit('updateUserIssues', resolve);
            res.send(apiResponse);
        }).catch((err) => {
            res.send(err);
        })
}//end of update issue

/**
 * @author Bhaskar Pawar
 * @description loads data initially
 * @param {*} req 
 * @param {*} res 
 */
let loadData = (req, res) => {
    findAssignees = () => {
        return new Promise((resolve, reject) => {
            UserModel.find({ roleId: 2 }, 'userId userName').select('-_id')
                .lean()
                .exec((err, userDetails) => {
                    if (err) {
                        logger.error('Error in fetching Assignee information', 'IssueController:loadCreationData:findAssignees()', 1);
                        let apiResponse = responseLib.generateResponse(true, 'Internal server error occured while fetching Assignee information', 202, null);
                        reject(apiResponse);
                    }
                    else if (checkLib.isEmpty(userDetails)) {
                        logger.error('No Assignees added', 'IssueController:loadCreationData:findAssignees()', 1);
                        let apiResponse = responseLib.generateResponse(true, 'currently no assignees present signup as assignee !', 201, null);
                        reject(apiResponse);
                    }
                    else {
                        logger.info('assignees fetched', 'IssueController:findAssignees()', 1);
                        resolve(userDetails);
                    }
                })
        })
    }// end of find Assignees

    findAssignees(req, res)
        .then((resolve) => {
            let apiResponse = responseLib.generateResponse(false, 'data fecthed', 200, resolve);
            res.send(apiResponse);
        }).catch((err) => {
            res.status(202);
            res.send(err);
        })

}// end of load creation data

eventEmitter.on('saveUserIssues', (data) => {
    issueControllerHlpr.addUsersToIssuesList(data.issueData.newIssue.issueId, data.issueData.newIssue.assignee, data.issueData.newIssue.assigneeName, true);
    issueControllerHlpr.addUsersToIssuesList(data.issueData.newIssue.issueId, data.issueData.newIssue.reporterUserId, data.issueData.newIssue.reporter, true);
})

eventEmitter.on('updateUserIssues', (data) => {
    issueControllerHlpr.updateUsersToIssueList(data.issueId, data.userId, data.assigneeName, data.isWatch);
})

module.exports = {
    createNewIssue: createNewIssue,
    loadData: loadData,
    getAllIssues: getAllIssues,
    getSingleIssue: getSingleIssue,
    updateIssue: updateIssue,
    uploadFile: uploadFile,
    uploadFileCloud: uploadFileCloud
}
