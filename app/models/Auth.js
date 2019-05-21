/** modules required for Auth model */
const mongoose = require('mongoose');
const time = require('../libs/timeLib');
const Schema = mongoose.Schema;

/**
 * Schema to store user Auth Details
 */
let authSchema = new Schema({
    userId: {
        type: String
    },
    authToken: {
        type: String
    },
    tokenSecret: {
        type: String
    },
    tokenGenerationTime: {
        type: Date,
        default: time.now()
    }
})

module.exports = mongoose.model('Auth', authSchema);