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
      newRoom(room, user.username);

      socket.join(room, () => {
        console.log('Rooms: ', socket.rooms)
        console.log('Add to the room: ', socket.room)
      })
    })

    //HACER DE NUEVO
    // if (allMessages.length > 0) {
    //   socket.emit('previousComments', allMessages);
    // }

    socket.on('addComment', message => {
      // console.log(Object.keys(io.sockets.sockets));
      console.log(`Message ==`);
      console.log(message);

      

      translate({
        text: 'me llamo mario',
        source: 'es',
        target: 'en'
      }, (result) => {
        console.log('TRADUCCION = ');
        console.log(result.translation);
        console.log('GROUPNAME = ');
        console.log(message.groupName);

        Chat.find({
            groupName: message.groupName
          })
          .then(chat => {
            console.log(chat);
            
            if (chat) {
              chat[0].messageHistory.push(message);
              console.log(chat[0]);
              chat[0].save()
                .then(() => {
                  console.log("SAVE OK");
                  console.log("SAVE OK");
                  console.log("SAVE OK");
                  
                  // res.status(200).json(chat);
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

        let response = []
        response.push(message);
        // socket.broadcast.to(socket.room).emit('comment:added', message)
        io.sockets.to(socket.room).emit('comment:added', response)
      });
    })

    socket.on('disconnect', function () {
      console.log("DISCONNECT");
      console.log(`Disconnect ${socket.id} on instance`);
    });

  })

  // function saveMessageDDBB()


  function findChatPosition(room) {
    let position = 0;
    chats.forEach(chat => {
      if (String(room) === String(chat.room)) {
        return
      }
      position++;
    });
    console.log(`Postion = ${position}`);
    return position;
  }

  function newRoom(room, socketId) {
    let exists = false;
    console.log("room = " + room);
    let position = 0;
    chats.forEach(chat => {
      console.log(`Chat room = ${chat.room}`);
      console.log(`Room = ${room}`);
      console.log(`Position ${position}`);

      if (String(room) === String(chat.room)) {
        exists = true;
        console.log(`Exist = ${exists}`);
        return
      }
      position++;
    });

    if (!exists) {

      let newChat = {};
      newChat.room = room;
      newChat.created_by = socketId;
      newChat.users = [];
      newChat.users.push(socketId)
      newChat.messageHistory = [];
      chats.push(newChat)
      console.log("New Chat");
      console.log(newChat);

    } else {
      console.log("Add USER");
      addUser(socketId, position)
    }
  }

  function addUser(userId, position) {
    let exists = false;
    console.log("userID = " + userId);
    console.log("Position = " + position);

    chats[Number(position)].users.forEach(user => {
      if (String(user) === String(userId)) {
        exists = true;
        return;
      }
    });
    if (!exists) {
      chats[Number(position)].users.push(userId)
    }
    console.log(chats[Number(position)]);
  }
}