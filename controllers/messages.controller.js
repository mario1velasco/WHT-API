const mongoose = require('mongoose');
const Message = require('../models/message.model');
const ApiError = require('../models/api-error.model');

// const MONGODB_URI = process.env.MONGODB_URI;

module.exports.get = (req, res, next) => {
  const {
    groupName,
    idUser
  } = req.params;
  Message.find({
      groupName: groupName,
      createdBy: {
        $ne: idUser
      },
      wasRead: false
    })
    .then(messages => {
      if (messages) {
        (messages.length === 0) ? res.json({wasRead: true}) : res.json({wasRead: false});
      } else {
        next(new ApiError(`Message NOT found`, 404));
      }
    }).catch(error => next(error));

}