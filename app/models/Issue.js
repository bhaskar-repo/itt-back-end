const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * This is to store issue related information
 * @author Bhaskar Pawar
 */
let issueSchema = new Schema({
    issueId: {
        type: String,
        default: '',
        index: true,
        unique: true
    },
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    comments: {
        type: String,
        default: ''
    },
    reporter: {
        type: String,
        default: '',
    },
    reporterUserId: {
        type: String,
    },
    assignee: {
        type: String,
        default: ''
    },
    assigneeName: {
        type: String
    },
    status: {
        type: String,
        enum: ['backlog', 'in-progress', 'in-test', 'done']
    },
    priority: {
        type: String,
        enum: ['Critical', 'Important', 'Incidental', 'Moderate']
    },
    createdBy: {
        type: String,
        default: ''
    },
    createdOn: {
        type: Date,
        default: ''
    },
    lastUpdateBy: {
        type: String,
        default: ''
    },
    lastUpdatedOn: {
        type: Date,
        default: ''
    }
})// end of issue schema

module.exports = mongoose.model('Issue', issueSchema);