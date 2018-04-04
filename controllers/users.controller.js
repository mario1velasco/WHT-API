const mongoose = require('mongoose');
const User = require('../models/user.model');
const ApiError = require('../models/api-error.model');

module.exports.create = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user != null) {
        next(new ApiError('User already registered', 400));
      } else {
        user = new User({
          email: req.body.email,
          password: req.body.password
        });
        user
          .save()
          .then(() => {
            res.status(200).json(user);
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

module.exports.get = (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        next(new ApiError(`User not found`, 404));
      }
    }).catch(error => next(error));
}

module.exports.edit = (req, res, next) => {
  const id = req.params.id;
  
  User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        next(new ApiError(`User not found`, 404));
      }
    }).catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new ApiError(error.message, 400, error.errors));
      } else {
        next(new ApiError(error.message, 500));
      }
    });
}
