const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @description This stores the sercret or information required repeatedly
 * @author Bhaskar Pawar
 */
let globalSchema = new Schema({

    secretKey: {
        type: String
    }
})

module.exports = mongoose.model('GlobalConfig', globalSchema);