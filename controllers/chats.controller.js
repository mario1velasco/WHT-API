const mongoose = require('mongoose');
const Chat = require('../models/chat.model');
const ApiError = require('../models/api-error.model');

// const MONGODB_URI = process.env.MONGODB_URI;

module.exports.create = (req, res, next) => {
  console.log(req.session);

  const {
    idUser
  } = req.params;
  Chat.findOne({
      groupName: req.body.groupName
    })
    .then(chat => {
      if (chat != null) {
        next(new ApiError('Chat with that group name already registered', 400));
      } else {
        let invitedUsername = randomPassword(30);
        let address = 'http://localhost:4200/chats/' + req.body.groupName + '/' + invitedUsername;
        chat = new Chat({
          groupName: req.body.groupName,
          createdBy: idUser,
          firstLanguage: req.body.firstLanguage,
          secondLanguage: req.body.secondLanguage,
          users: [idUser],
          invitedAddress: address,
          invitedUsername: invitedUsername
        });
        chat
          .save()
          .then(() => {
            res.status(200).json(chat);
          })
          .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
              next(new ApiError(error.errors, 400));
            } else {
              next(error);
            }
          });
      }
    })
    .catch(error => next(error));
}

function randomPassword(length) {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
  var pass = "";
  for (var x = 0; x < length; x++) {
    var i = Math.floor(Math.random() * chars.length);
    pass += chars.charAt(i);
  }
  return pass;
}

module.exports.show = (req, res, next) => {
  const {
    idUser
  } = req.params;
  Chat.find({
      users: idUser
    })
    .then(chats => {
      if (chats) {
        console.log(chats);

        res.json(chats)
      } else {
        next(new ApiError(`Chat not found`, 404));
      }
    }).catch(error => next(error));
}

module.exports.get = (req, res, next) => {
  const {
    groupName
  } = req.params;
  Chat.find({
      groupName: groupName
    })
    .then(chat => {
      if (chat) {
        console.log(chat);

        res.json(chat)
      } else {
        next(new ApiError(`Chat not found`, 404));
      }
    }).catch(error => next(error));
}
module.exports.showAll = (req, res, next) => {
  Chat.find()
    .then(chats => {
      if (chats) {
        console.log(chats);

        res.json(chats)
      } else {
        next(new ApiError(`Chat not found`, 404));
      }
    }).catch(error => next(error));
}



module.exports.addUser = (req, res, next) => {
  const {
    idUser
  } = req.params;
  const {
    groupName,
    userToAdd,
    secondLanguage
  } = req.body;
  Chat.find({groupName: groupName})
  .then((chat) => {
    console.log(chat);
    if (chat[0].users.length < 2){
      chat[0].users.push(userToAdd);
      chat[0].secondLanguage = secondLanguage;
      chat[0].isInvited = true;
      chat[0].save();
      res.status(200).json(chat);
    } else {
      next(new ApiError(`You cannot add more users`, 412));
    }
  })
  .catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new ApiError(error.errors, 400));
    } else {
      next(error);
    }
  });

}
    // Chat.update({
    //     groupName: groupName
    //   }, {
    //     $addToSet: {
    //       users: userToAdd
    //     },
    //     $set: {
    //       isInvited: false
    //     },
    //     secondLanguage
    //   })
    //   .then((chat) => {
    //     console.log(chat);
  
    //     res.status(200).json(chat);
    //   })
    //   .catch(error => {
    //     if (error instanceof mongoose.Error.ValidationError) {
    //       next(new ApiError(error.errors, 400));
    //     } else {
    //       next(error);
    //     }
    //   });


module.exports.leaveChat = (req, res, next) => {
  const {
    idUser,
    groupName
  } = req.params;
  Chat.update({
      groupName: groupName
    }, {
      $pullAll: {
        users: [idUser]
      }
    }).then(chat => {
      res.status(200).json({
        message: "Leave chat correcty"
      });
    })
    .catch(error => next(error));
}

module.exports.deleteChat = (req, res, next) => {
  const {
    groupName
  } = req.params;
  const id = req.params.id;
  Chat.findOneAndRemove({groupName: groupName})
    .then(chat => {
      if (chat) {
        res.status(204).json()
      } else {
        next(new ApiError(`Chat not found`, 404));
      }
    }).catch(error => next(error));
}

// module.exports.get = (req, res, next) => {
//   const id = req.params.id;
//   Chat.findById(id)
//     .then(chat => {
//       if (chat) {
//         res.json(chat)
//       } else {
//         next(new ApiError(`Chat not found`, 404));
//       }
//     }).catch(error => next(error));
// }

// module.exports.edit = (req, res, next) => {
//   const id = req.params.id;
//   console.log(req.chat);

//   Chat.findByIdAndUpdate(id, { $set: req.body }, { new: true })
//     .then(chat => {
//       if (chat) {
//         res.json(chat)
//       } else {
//         next(new ApiError(`Chat not found`, 404));
//       }
//     }).catch(error => {
//       if (error instanceof mongoose.Error.ValidationError) {
//         next(new ApiError(error.message, 400, error.errors));
//       } else {
//         next(new ApiError(error.message, 500));
//       }
//     });
// }