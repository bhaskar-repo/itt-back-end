/**modules required by application */
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const appConfig = require('./config/appConfig');
const logger = require('./app/libs/loggerLib');
const routeLoggerMiddleware = require('./app/middlewares/routeLogger.js');
const globalErrorMiddleware = require('./app/middlewares/appErrorHandler');
const helmet = require('helmet');
const app = express();

app.use(helmet());
app.use(bodyParser.json());/** to parse request body parameters */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(routeLoggerMiddleware.logIp);
app.use(globalErrorMiddleware.globalErrorHandler);

let models = './app/models';
let routes = './app/routes';

//Bootstrap models
fs.readdirSync(models).forEach(function (file) {
    if (file.indexOf('.js')) require(models + '/' + file)
  });
  // end Bootstrap models
  
  // Bootstrap route
  fs.readdirSync(routes).forEach(function (file) {
    if (file.indexOf('.js')) {
      let route = require(routes + '/' + file);
      route.setRouter(app);
    }
  });

app.use(globalErrorMiddleware.globalNotFoundHandler);

let server = http.createServer(app);
server.listen(appConfig.port)//end of listen
server.on('error', onError);
server.on('listening', onListening);

const socketLib = require('./app/libs/socketLib');
socketLib.setServer(server);


function onError(error) {
    if (error.syscall !== 'listen') {
        logger.error(error.code + ' not equal listen', 'serverOnErrorHandler', 10)
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10);
            process.exit(1);
            break;
        default:
            logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {

    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    ('Listening on ' + bind);
    logger.info('server listening on port' + addr.port, 'serverOnListeningHandler', 10);
    let db = mongoose.connect(appConfig.dbUrl, { useNewUrlParser: true, useCreateIndex: true });
}

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});


/**
 * database connection settings
 */
mongoose.connection.on('error', function (err) {
    console.log('database connection error');
    console.log(err)
    logger.error(err, 'mongoose connection on error handler', 10)
    //process.exit(1)
}); // end mongoose connection error

mongoose.connection.on('open', function (err) {
    if (err) {
        console.log("database error");
        console.log(err);
        logger.error(err, 'mongoose connection open handler', 10)
    } else {
        console.log("database connection open success");
        logger.info("database connection open", 'database connection open handler', 10)
    }
    //process.exit(1)
}); // enr mongoose connection open handler