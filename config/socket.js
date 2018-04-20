const mongoose = require('mongoose');
const Chat = require('../models/chat.model');
const Message = require('../models/message.model');

// module.exports = function () {
module.exports.iosocket = (server) => {
  let noMessage = {
    wasRead: false,
    firstLanguage: 'en',
    secondLanguage: 'en',
    chatCreatedBy: 'WHT? Group',
    groupName: 'room',
    createdBy: 'WHT? Group',
    firstText: 'Become Super User to read old messages',
    secondText: 'Become Super User to read old messages',
  };
  let translate = require('node-google-translate-skidz');
  const io = require('socket.io')(server);
  io.on('connection', (socket) => {
    console.log(`Connected ${socket.id} on instance`);
    console.log('ROOMS ROOMS ROOMS: ', socket.rooms);




    socket.on('join', (room, user) => {
      console.log('ROOMS ROOMS ROOMS: ', socket.rooms);
      socket.room = room;
      console.log(`JOIN SOCKET ${socket.id}`);
      socket.join(room, () => {
        console.log('Rooms: ', socket.rooms);
        console.log('Add to the room: ', socket.room);
        console.log('ROOMS ROOMS ROOMS: ', socket.rooms);
        Chat.find({
            groupName: room
          })
          .then(chat => {
            if (chat) {
              // for (const usr of chat.users) {
              //   if (usr !== user.id) {
              //     User.findById()
              //   }else{

              //   }
              // }
              if (user && (user.role === 'SUPERUSER')) {
                Message.find({
                    groupName: room
                  })
                  .then(messages => {
                    getMessages(room, user, messages, chat);

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
                    getMessages(room, user, messages, chat);

                    // console.log('USER');
                    // messages.unshift(noMessage);
                    // socket.emit('previousMessages', messages, chat);
                    // messages.shift();
                    // messages.forEach((message, index, object) => {
                    //   if (message.createdBy !== user.id) {
                    //     console.log('USER');
                    //     console.log('USER');
                    //     console.log('USER');
                    //     console.log(message);
                    //     message.wasRead = true;
                    //     message.save();
                    //   }
                    // });
                  }).catch(error => console.log(error));
              } else {
                socket.emit('previousMessages', noMessage, chat);
              }

            } else {
              next(new ApiError(`Chat not found`, 404));
            }
          }).catch(error => next(error));


      })
    })

    function getMessages(room, user, messages, chat) {
      console.log(user.role);
      if (user.role === "SUPERUSER" || messages.length === 0) {
        noMessage.firstText = 'This is the beggining of the chat';
        noMessage.secondText = 'This is the beggining of the chat';
      } 
      messages.unshift(noMessage);
      socket.emit('previousMessages', messages, chat);
      console.log(user.role);
      messages.shift();

      messages.forEach((message, index, object) => {
        if (((user.role === 'SUPERUSER') && (message.createdBy !== user.id) && (!message.wasRead))
          ||(((user.role === 'USER') && (message.createdBy !== user.id)))){
          message.wasRead = true;
          message.save();
        } 
      });
    }

    socket.on('leaveALLrooms', () => {
      if (socket.rooms !== {}) {
        console.log("LEAVING ALL ROOMS ROOMS");
        let val = Object.keys(socket.rooms);
        console.log(val);
        val.forEach(element => {
          socket.leave(element, () => {
            console.log(`User has LEAVE the chatGroup named ${element}`);
          });
        });
      }
      console.log('ROOMS ROOMS ROOMS: ', socket.rooms);

    });

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
                  // console.log(io.sockets.adapter.rooms['number1'].sockets)
                  console.log("ADAPTER ROOMS ROOMS")
                  console.log(io.sockets.adapter.rooms)
                  io.sockets.to(socket.room).emit('comment:added', response);
                  // socket.broadcast.emit('comment:added', response);
                  // socket.emit('comment:added', response);
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

    socket.on('notifyDeleteChat:SendFromClient', data => {
      // io.of('nsp').emit('updateChatList:SendFromServer', data);
      socket.broadcast.emit('notifyDeleteChat:SendFromServer', data);
      // socket.emit('updateChatList:SendFromServer', data);
    });


  })

}