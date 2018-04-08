const mongoose = require('mongoose');
const Chat = require('../models/chat.model');
const ApiError = require('../models/api-error.model');

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
        chat = new Chat({
          groupName: req.body.groupName,
          createdBy: idUser,
          originalLanguage: req.body.originalLanguage,
          language: req.body.language,
          users: [idUser],
          time: req.body.time,
          originalText: "HERE IS THE BEGGINING",
          text: "HERE IS THE BEGGINING"
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

module.exports.showId = (req, res, next) => {
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

module.exports.show = (req, res, next) => {
  const {
    idUser
  } = req.params;
  Chat.distinct('groupName', {
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

module.exports.addUser = (req, res, next) => {
  const {
    idUser
  } = req.params;
  const {
    groupName,
    userToAdd
  } = req.body;
  console.log(userToAdd);

  Chat.update({
    groupName: groupName
  }, {
    $addToSet: {
      users: userToAdd
    }
  })
  .then((chat) => {
    res.status(200).json(chat);
  })
  .catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new ApiError(error.errors, 400));
    } else {
      next(error);
    }
  });



  // Chat.find({
  //     groupName: groupName
  //   })
  //   .then(chat => {
  //     if (chat) {
  //       chat[0].users.push(userToAdd);
  //       console.log(chat[0]);
  //       chat[0].save()
  //         .then(() => {
  //           res.status(200).json(chat);
  //         })
  //         .catch(error => {
  //           if (error instanceof mongoose.Error.ValidationError) {
  //             next(new ApiError(error.errors, 400));
  //           } else {
  //             next(error);
  //           }
  //         });
  //     } else {
  //       next(new ApiError(`User not found`, 404));
  //     }
  //   }).catch(error => next(error));
}


// module.exports.show = (req, res, next) => {
//   const {
//     idUser
//   } = req.params;
//   Chat.find({users:idUser})
//     .then(chats => {
//       if (chats) {
//         res.json(chats)
//       } else {
//         next(new ApiError(`Chat not found`, 404));
//       }
//     }).catch(error => next(error));
// }

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