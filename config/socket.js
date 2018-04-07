// const Chat = require('../models/chat.model');

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

    socket.on('join', room => {
      socket.room = room
      console.log(`JOIN SOCKET ${socket.id}`);
      newRoom(room, socket.id);
      // addUser(socket.id, room);
      // created_by = created_by || socket.id;
      // chat.created_by=chat.created_by || socket.id;
      // console.log(`NEW ROOM CREATED BY = ${chat.created_by}`);

      socket.join(room, () => {
        // chat.room = chat.room || socket.room;
        console.log('Rooms: ', socket.rooms)
        console.log('Room: ', socket.room)
      })
    })

    //Esto hay q rehacerlo
    //HACER DE NUEVO
    // if (allMessages.length > 0) {
    //   socket.emit('previousComments', allMessages);
    // }

    socket.on('addComment', message => {
      // console.log(Object.keys(io.sockets.sockets));
      let pos = findChatPosition(socket.room)
      console.log(`Message ==`);
      console.log(message);
      console.log(`Position == ${pos}`);

      chats[pos].messageHistory.push(message)
      console.log(chats[pos]);

      translate({
        text: 'hola me llamo mario',
        source: 'es',
        target: 'en'
      }, function (result) {
        console.log(result);
      });

      let response = []
      response.push(message);
      // socket.broadcast.to(socket.room).emit('comment:added', message)
      io.sockets.to(socket.room).emit('comment:added', response)
    })


    socket.on('disconnect', function () {
      console.log("DISCONNECT");
      console.log(`Disconnect ${socket.id} on instance`);
    });

  })

  
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