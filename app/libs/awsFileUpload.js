// This library defines the cloud file storage
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const multer = require('multer');

let credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
AWS.config.credentials = credentials;

const s3 = new AWS.S3();

/**
 * @author Bhaskar Pawar
 * @description holds storage information
 */
let awsUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'mycom-cloud-demo',
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '_' + file.originalname);
        }
    })
})

module.exports = awsUpload