const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LANGUAGES_CATEGORIES = require('./chat-languages-categories');

const messageSchema = new mongoose.Schema({

  chatCreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Creator is required'],
    ref: 'Chat'
  },
  createdBy: {
    type: String,
    required: [true, 'Creator is required']
  },
  groupName: {
    type: String,
    required: [true, 'Group name is required']
  },
  wasRead: {
    type: Boolean,
    default: false
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
  firstText: {
    type: String,
    required: [true, 'Invited user name is required']
  },
  secondText: {
    type: String,
    required: [true, 'Invited user name is required']
  },
  time: {
    type: String,
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


const Message = mongoose.model('Message', messageSchema);
module.exports = Message;