const mongoose = require('mongoose');
const Chat = require('../models/chat.model');

// module.exports = function () {
module.exports.iosocket = (server) => {
  let allMessages = [];
  let created_by;
  let users = [];
  let chat = {
    room: "",
    users: [],
    created_by: "",
    messageHistory: []
  };
  let chats = [];
  let translate = require('node-google-translate-skidz');
  const io = require('socket.io')(server);
  io.on('connection', (socket) => {
    //AQUI TIEES QUE SACER EL USERNAME Y PONER
    // SOCKEt.id=username      
    console.log(`Connected ${socket.id} on instance`);

    socket.on('join', (room, user) => {
      //ESTO NO FUNCIONA
      // socket.id = user.username;
      //ESTO NO FUNCIONA
      socket.room = room;
      console.log(`JOIN SOCKET ${socket.id}`);
      // newRoom(room, user.username);

      socket.join(room, () => {
        console.log('Rooms: ', socket.rooms)
        console.log('Add to the room: ', socket.room)

        socket.emit('previousComments', (messageHistory) => {
          Chat.find({
              groupName: room
            })
            .then(chat => {
              if (chat) {
                chat[0].messageHistory.push(message);

              } else {
                next(new ApiError(`User not found`, 404));
              }
            }).catch(error => next(error));
        });
      })
    })


    socket.on('addComment', message => {
      // console.log(Object.keys(io.sockets.sockets));
      console.log(`Message ==`);
      console.log(message);
      let source, target;
      if (message.createdBy === message.chatCreatedBy) {
        source = message.firstLanguage;
        target = message.secondLanguage
      } else {
        source = message.secondLanguage;
        target = message.firstLanguage
      }
      console.log('SOURCE AND TARGET');
      console.log(source);
      console.log(target);
      
      translate({
        text: message.firstText,
        source: 'es',
        target: 'en'
      }, (result) => {
        console.log('TRADUCCION = ');
        console.log(result.translation);
        message.secondText = result.translation;
        Chat.find({
            groupName: message.groupName
          })
          .then(chat => {
            if (chat) {
              chat[0].messageHistory.push(message);
              chat[0].save()
                .then(() => {
                  console.log("SAVE OK");
                  let response = {
                    message: message,
                    chat: chat[0]
                  };
                  console.log(response);

                  io.sockets.to(socket.room).emit('comment:added', response)
                })
                .catch(error => {
                  if (error instanceof mongoose.Error.ValidationError) {
                    next(new ApiError(error.errors, 400));
                  } else {
                    next(error);
                  }
                });
            } else {
              next(new ApiError(`User not found`, 404));
            }
          }).catch(error => next(error));
      });
    })

    socket.on('disconnect', function () {
      console.log("DISCONNECT");
      console.log(`Disconnect ${socket.id} on instance`);
    });

  })

}