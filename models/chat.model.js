const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LANGUAGES_CATEGORIES = require('./chat-languages-categories');

const chatSchema = new mongoose.Schema({
  groupName: {
    type: String,
    unique: true,
    required: [true, 'Group name is required']
  },
  users: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: [],
    validate: {
      validator: function (v) {
        console.log('AAAAAAAAAAAA');
        console.log('BBBBBBBBBBBBB');
        console.log(v);

        if (v.length <= 2) {
          return true;
        }
        return false;
      },
      message: 'You can not have more than 2 users'
    }
  },
  // users: {
  //   type: [{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User'
  //   }],
  //   default: []
  // },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Creator is required'],
    ref: 'User'
  },
  firstLanguage: {
    type: String,
    enum: LANGUAGES_CATEGORIES,
    required: [true, 'Original language is required'],
    default: "en"
  },
  secondLanguage: {
    type: String,
    enum: LANGUAGES_CATEGORIES,
    required: [true, 'Language is required'],
    default: "en"
  },
  // messageHistory: {
  //   type: Array,
  //   default: []
  // },
  isInvited: {
    type: Boolean,
    default: true
  },
  invitedAddress: {
    type: String,
    unique: true,
    required: [true, 'Invited address is required']
  },
  invitedUsername: {
    type: String,
    unique: true,
    required: [true, 'Invited user name is required']
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;

      return ret;
    }
  }
});

// chatSchema.path('users').validate(function (value, done) {
//   var self = this;
//   console.log('AAAAAAAAAAAA');
//   console.log('BBBBBBBBBBBBB');
//   console.log('CCCCCCCCCCCCCC');
//   console.log(self);
// }, "This email already exists");

// chatSchema.pre('update', function(next) {
//   console.log('CHAT CHAT');
//   const chat = this;
//   // console.log(chat);
//   debugger;   
//   console.log(this);
//   console.log('CHAT USRES');

//   if (this.users.length > 2) {
//     return next();
//   }else{
//     var err = new Error('You cannot add more users');
//     next(err);
//   }
// });
function randomPassword(length) {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
  var pass = "";
  for (var x = 0; x < length; x++) {
    var i = Math.floor(Math.random() * chars.length);
    pass += chars.charAt(i);
  }
  return pass;
}

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;