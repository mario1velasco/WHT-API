const mongoose = require('mongoose');
const Chat = require('../models/chat.model');
const Message = require('../models/message.model');

// module.exports = function () {
module.exports.iosocket = (server) => {
  let noMessage = {
    groupName: 'room',
    chatCreatedBy: 'WHT? Group',
    createdBy: 'WHT? Group',
    firstLanguage: 'en',
    firstText: 'Become Super User to read old messages',
    secondLanguage: 'en',
    secondText: 'Become Super User to read old messages'
  };
  let translate = require('node-google-translate-skidz');
  const io = require('socket.io')(server);
  io.on('connection', (socket) => {
    console.log(`Connected ${socket.id} on instance`);

    socket.on('join', (room, user) => {
      console.log('ROOMS ROOMS ROOMS: ', socket.rooms);
      socket.room = room;
      console.log(`JOIN SOCKET ${socket.id}`);
      socket.join(room, () => {
        console.log('Rooms: ', socket.rooms);
        console.log('Add to the room: ', socket.room);
        console.log('ROOMS ROOMS ROOMS: ', socket.rooms);
        if (user && (user.role === 'SUPERUSER')) {
          Message.find({
              groupName: room
            })
            .then(messages => {
              console.log('SUPERUSER');
              noMessage.firstText = 'This is the beggining of the chat';
              noMessage.secondText = 'This is the beggining of the chat';
              messages.unshift(noMessage);
              socket.emit('previousMessages', messages);
              messages.forEach((message, index, object) => {
                if ((message.createdBy !== user.id) && (!message.wasRead)) {
                  console.log('SUPERUSER');
                  console.log('SUPERUSER');
                  console.log('SUPERUSER');
                  message.wasRead = true;
                  message.save();
                }
              });
            }).catch(error => next(error));
        } else if (user && (user.role === 'USER')) {
          Message.find({
              groupName: room,
              wasRead: false,
              createdBy: {
                $ne: user.id
              }
            })
            .then(messages => {
              console.log('USER');
              messages.unshift(noMessage);
              socket.emit('previousMessages', messages);
              messages.shift();
              messages.forEach((message, index, object) => {
                if (message.createdBy !== user.id) {
                  debugger
                  console.log('USER');
                  console.log('USER');
                  console.log('USER');
                  console.log(message);
                  message.wasRead = true;
                  message.save();
                }
              });
            }).catch(error => console.log(error));
        } else {
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
      // socket.removeAllListeners();
      // io.removeAllListeners();
      socket.disconnect(true);
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
                  io.sockets.to(socket.room).emit('comment:added', response);
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
      message.wasRead = true;
      Message.findByIdAndUpdate(message.id, message)
        .catch(error => console.log(error));
    });
    socket.on('updateChatList:SendFromClient', data => {    
      // io.of('nsp').emit('updateChatList:SendFromServer', data);
      socket.broadcast.emit('updateChatList:SendFromServer', data);
      socket.emit('updateChatList:SendFromServer', data);
    });


  })

}