const mongoose = require('mongoose');
const Chat = require('../models/chat.model');
const User = require('../models/user.model');
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
            console.log('QQQQQQQQ');
            console.log(chat[0].users);
            if (chat) {
              if (chat[0].users.length <= 1) {
                getMessages(room, user, chat, {});
              } else {
                chat[0].users.forEach(id => {
                  if (id.toString() !== user.id.toString()) {
                    console.log('AAAAAAA');
                    console.log('Second user = ' + id);
                    User.findById(id)
                      .then(sndUser => {
                        getMessages(room, user, chat, sndUser)
                      });
                  }
                });
              }
            } else {
              next(new ApiError(`Chat not found`, 404));
            }
          }).catch(error => next(error));
      })
    })

    function getMessages(room, user, chat, sndUser) {
      if (user && (user.role === 'SUPERUSER')) {
        Message.find({
            groupName: room
          })
          .sort({createdAt: 'asc'})
          .then(messages => {
            emmitAndSaveMessages(room, user, messages, chat, sndUser);

          }).catch(error => next(error));
      } else if (user && (user.role === 'USER')) {
        Message.find({
            groupName: room,
            wasRead: false,
            createdBy: {
              $ne: user.id
            }
          }).sort({createdAt: 'asc'})
          .then(messages => {
            emmitAndSaveMessages(room, user, messages, chat, sndUser);

          }).catch(error => console.log(error));
      } else {
        socket.emit('previousMessages', noMessage, chat, sndUser);
      }
    }

    function emmitAndSaveMessages(room, user, messages, chat, sndUser) {
      console.log(user.role);
      if (user.role === "SUPERUSER" || messages.length === 0) {
        noMessage.firstText = 'This is the beggining of the chat';
        noMessage.secondText = 'This is the beggining of the chat';
      }
      messages.unshift(noMessage);
      socket.emit('previousMessages', messages, chat, sndUser);
      console.log(user.role);
      messages.shift();

      messages.forEach((message, index, object) => {
        if (((user.role === 'SUPERUSER') && (message.createdBy !== user.id) && (!message.wasRead)) ||
          (((user.role === 'USER') && (message.createdBy !== user.id)))) {
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
            console.log("AAAAAAAAAA");
            console.log(chat);
            if (message.isInvited) {
              chat[0].secondLanguage = message.firstLanguage;
              chat.forEach(cht => {
                cht.save();                
              });
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