/**modules required for this model */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**This is the table where user information will be stored 
 * @author Bhaskar Pawar
*/
let userSchema = new Schema({
    userId: {
        type: String,
        default: undefined,
        index: true,
        unique: true
    },
    firstName: {
        type: String,
        default: undefined
    },
    lastName: {
        type: String,
        default: undefined
    },
    email: {
        type: String,
        default: undefined
    },
    userName: {
        type: String,
        default: undefined
    },
    password: {
        type: String,
        default: undefined
    },
    mobileNumber: {
        type: Number,
        default: undefined
    },
    roleId: { // user to identify based on roles
        type: Number,
        default: undefined
    },
    createdOn: {
        type: Date,
        default: undefined
    }

})// end of user model

module.exports = mongoose.model('User', userSchema);