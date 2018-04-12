const mongoose = require('mongoose');
const User = require('../models/user.model');
const ApiError = require('../models/api-error.model');

module.exports.create = (req, res, next) => {
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (user != null) {
        next(new ApiError('User already registered', 400));
      } else {
        user = new User({
          email: req.body.email,
          password: req.body.password,
          username: req.body.username
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

module.exports.show = (req, res, next) => {
  User.find()
    .then(users => {
      if (users) {
        res.status(200).json(users);
      } else {
        next(new ApiError(`Users not found`, 404));
      }
    }).catch(error => next(error));
}

module.exports.get = (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        next(new ApiError(`User not found`, 404));
      }
    }).catch(error => next(error));
}

module.exports.edit = (req, res, next) => {
  const id = req.params.id;

  User.findByIdAndUpdate(id, {
      $set: req.body
    }, {
      new: true
    })
    .then(user => {
      if (user) {
        console.log('AAAAAAAAAA');
        console.log(user.name);
        console.log(user.familyname);
        console.log(user.telephone);

        if (user.name && user.familyname && user.telephone) {
          user.role = 'SUPERUSER';
        } else {
          user.role = 'USER';
        }
        user.save()
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