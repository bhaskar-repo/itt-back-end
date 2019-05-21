/**
 * This is the configuration file for entire application
 */
let appConfig = {
    port: 3000,
    env: 'prod',
    corsAllowedOrigin: '*',
    apiVersion: '/api/v1',
    dbUrl: 'mongodb://localhost:27017/issueTrackingDB'
}

module.exports = {
    port: appConfig.port,
    env: appConfig.env,
    corsAllowedOrigin: appConfig.corsAllowedOrigin,
    apiVersion: appConfig.apiVersion,
    dbUrl: appConfig.dbUrl
}