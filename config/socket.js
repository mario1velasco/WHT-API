const mongoose = require('mongoose');
const Chat = require('../models/chat.model');

// module.exports = function () {
module.exports.iosocket = (server) => {
  let translate = require('node-google-translate-skidz');
  const io = require('socket.io')(server);
  io.on('connection', (socket) => {
    console.log(`Connected ${socket.id} on instance`);

    socket.on('join', (room) => {
      socket.room = room;
      console.log(`JOIN SOCKET ${socket.id}`);
      socket.join(room, () => {
        console.log('Rooms: ', socket.rooms)
        console.log('Add to the room: ', socket.room)

        Chat.find({
            groupName: room
          })
          .then(chat => {
            if (chat) {
              socket.emit('previousMessages', (chat[0].messageHistory));
            } else {
              socket.emit('previousMessages', 'There are not previous messages');
            }
          }).catch(error => next(error));

      })
    })
    socket.on('leave room', (room) => {
      socket.leave(room, () => {
        console.log(`User has LEAVE the chatGroup named ${room}`);
      });
    })

    socket.on('disconnect', function () {
      console.log(`DISCONNECT ${socket.id} on instance`);
    });

    socket.on('addComment', message => {
      // console.log(Object.keys(io.sockets.sockets));
      console.log(`Message ==`);
      console.log(message);
     
      Chat.find({
          groupName: message.groupName
        })
        .then(chat => {
          if (chat) {            
            if (message.isInvited){
              chat[0].secondLanguage = message.firstLanguage;
            }
            translate({
              text: message.firstText,
              source: message.firstLanguage,
              target: message.secondLanguage
            }, (result) => {
              console.log('TRADUCCION = ');
              console.log(result.translation);
              message.secondText = result.translation;
              chat[0].messageHistory.push(message);
              chat[0].save()
                .then(() => {
                  console.log("SAVE OK");
                  let response = {
                    message: message,
                    chat: chat[0]
                  };
                  io.sockets.to(socket.room).emit('comment:added', response)
                })
                .catch(error => {
                  if (error instanceof mongoose.Error.ValidationError) {
                    next(new ApiError(error.errors, 400));
                  } else {
                    next(error);
                  }
            });
              });
          } else {
            next(new ApiError(`User not found`, 404));
          }
        }).catch(error => next(error));

    })
  })

}