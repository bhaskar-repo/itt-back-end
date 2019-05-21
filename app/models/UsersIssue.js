/**
 * created this schema to store the user who is a part of which issues.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersIssueSchema = new Schema({
    id: {
        type: String,
        index: true
    },
    issueId: {
        type: String,
    },
    userId: {
        type: String
    },
    userName: {
        type: String
    },
    isWatch: {
        type:Boolean,
        default: false
    }

})

module.exports = mongoose.model('UsersIssue', usersIssueSchema);