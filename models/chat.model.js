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
    unique: true,
    default: []
  },
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
  messageHistory: {
    type: Array,
    default: []
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

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;