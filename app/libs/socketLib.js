const mongoose = require('mongoose');
const socketIo = require('socket.io');
const tokenLib = require('../libs/tokenLib');
const checkLib = require('../libs/checkLib');
const logger = require('../libs/loggerLib');
const AuthModel = mongoose.model('Auth');
const issueControllerHlpr = require('../controllers/issueControllerHlpr');
const events = require('events');
const eventEmitter = new events.EventEmitter();

/**
 * @description socket connection initialization
 * @author Bhaskar Pawar
 * @param {*} server 
 */
let setServer = (server) => {
  let io = socketIo.listen(server);
  let myIo = io.of('');

  myIo.on('connection', (socket) => {
    socket.emit('verify-user', "");
    socket.on('set-user', (authToken) => {
      AuthModel.findOne({ authToken: authToken }, (err, authDetails) => {
        if (err) {
          logger.error(err.message, 'Socket Connection', 1);
        } else if (checkLib.isEmpty(authDetails)) {
          logger.error('No AuthorizationKey Is Present', 'Socket Connection', 10)
        } else {
          tokenLib.verifyToken(authDetails.authToken, authDetails.tokenSecret, (err, decoded) => {
            if (err) {
              logger.error(err.message, 'Socket Connection', 10)
            }
            else {
              let currentUser = decoded.data;
              socket.userId = currentUser.userId;
              console.log(socket.id);
            }
          });// end verify token

        }
      })
    })

    socket.on('leave-this-room', (issueId) => {
      socket.leave(issueId);
    })

    socket.on('users-issues', (data) => {
      if (data != null) {
        data.forEach(element => {
          socket.join(element.issueId);
        });
      }
    })

    socket.on('add-to-watchers', (data) => {
      eventEmitter.emit('add-to-users-issue', data);
      let descIo = io.of(`/api/v1/issues/${data.issueId}/description`);
      descIo.on('connection', (socket) => {
        issueControllerHlpr.returnWatchers(data.issueId, (err, watchers) => {
          if (err) {
            console.log(err);
          }
          else {
            let data = {
              watchers: watchers
            }
            descIo.emit('watchers-list', data);
          }
        });
      })
      socket.room = data.issueId;
      socket.join(data.issueId);
    })

    socket.on('remove-from-watchers', (data) => {
      let descIo = io.of(`/api/v1/issues/${data.issueId}/description`);
      eventEmitter.emit('remove-from-users-issue', data);
      descIo.on('connection', (descSocket) => {

        issueControllerHlpr.returnWatchers(data.issueId, (err, watchers) => {
          if (err) {
            console.log(err);
          }
          else {
            let data = {
              watchers: watchers
            }
            descIo.emit('watchers-list', data);
          }
        });
      })
      socket.leave(data.issueId);
    })

    socket.on('update-issue', (data) => {
      let sendData = {
        issueId: data.issueId,
        title: data.title,
        userName: data.userName,
        auditString: data.auditString
      }

      socket.to(data.issueId).emit('updated', sendData);
    })

    socket.on('disconnect', () => {
      console.log("disconnected socket")
    })
  })
}//end of set server

eventEmitter.on('add-to-users-issue', (data) => {
  issueControllerHlpr.updateUsersToIssueList(data.issueId, data.userId, data.userName, data.isWatch);
})

eventEmitter.on('remove-from-users-issue', (data) => {
  issueControllerHlpr.updateUsersToIssueList(data.issueId, data.userId, data.userName, false);
})

module.exports = {
  setServer: setServer
}