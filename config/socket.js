const mongoose = require('mongoose');
const Chat = require('../models/chat.model');
const Message = require('../models/message.model');

// module.exports = function () {
module.exports.iosocket = (server) => {
  let translate = require('node-google-translate-skidz');
  const io = require('socket.io')(server);
  io.on('connection', (socket) => {
    console.log(`Connected ${socket.id} on instance`);

    socket.on('join', (room, user) => {
      socket.room = room;
      console.log(`JOIN SOCKET ${socket.id}`);
      socket.join(room, () => {
        console.log('Rooms: ', socket.rooms);
        console.log('Add to the room: ', socket.room);
        if (user && (user.role === 'SUPERUSER')) {
          console.log('SUPERUSER');
          console.log('SUPERUSER');
          console.log('SUPERUSER');
          Message.find({
              groupName: room
            })
            .then(messages => {
              socket.emit('previousMessages', messages);
            }).catch(error => next(error));
        } else if (user && (user.role === 'USER')) {
          console.log('USER');
          console.log('USER');
          console.log('USER');

          Message.find({
              groupName: room,
              wasRead: false,
              createdBy: {$ne : user.id}
            })
            .then(messages => {
              messages.forEach((message, index, object) => {
                if (message.createdBy !== user.id) {
                  message.wasRead = true;
                  message.save();
                }
              });
              socket.emit('previousMessages', messages);
            }).catch(error => console.log(error));
        } else {
          let noMessage = {
            groupName: room,
            chatCreatedBy: user.id,
            createdBy: user.id,
            firstLanguage: 'en',
            firstText: 'Become Super User to read old messages',
            secondLanguage: 'en',
            secondText: 'Become Super User to read old messages'
          };
          socket.emit('previousMessages', noMessage);
        }

      })
    })
    socket.on('leave room', (room) => {
      socket.leave(room, () => {
        console.log(`User has LEAVE the chatGroup named ${room}`);
      });
    })

    socket.on('disconnect', () => {
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
            if (message.isInvited) {
              chat[0].secondLanguage = message.firstLanguage;
              chat[0].save();
            }
            translate({
              text: message.firstText,
              source: message.firstLanguage,
              target: message.secondLanguage
            }, (result) => {
              console.log('TRADUCCION = ');
              console.log(result.translation);
              message.secondText = result.translation;
              // chat[0].messageHistory.push(message);
              newMessage = new Message(message);
              newMessage.save()
                .then(() => {
                  console.log("SAVE MESSAGE OK");
                  let response = {
                    message: newMessage
                  };
                  socket.broadcast.emit('notifymessage', response);
                  io.sockets.to(socket.room).emit('comment:added', response)
                  // socket.emit('comment:added', response);
                })
                .catch(error => {
                  console.log(error);
                  io.sockets.to(socket.room).emit('comment:added', error)
                });
            });
          } else {
            next(new ApiError(`User not found`, 404));
          }
        }).catch(error => next(error));

    })

    socket.on('messageRead', message => {
      message.wasRead=true;
      Message.findByIdAndUpdate(message.id, message)
      .catch(error => console.log(error));
    });


  })

}