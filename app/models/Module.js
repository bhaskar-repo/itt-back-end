const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * All module and file related information is stored here
 */
let moduleSchema = new Schema({

    issueId: {
        type: String,
        default: '',
        index: true
    },
    fileId: {
        type: String,
        default: ''
    },
    moduleName: {
        type: String
    },
    fileName: {
        type: String,
    },
    fileLocation: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdOn: {
        type: Date
    },
    lastUpdateBy: {
        type: String
    },
    lastUpdatedOn: {
        type: Date
    }
})

module.exports = mongoose.model('Module', moduleSchema);
