const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LANGUAGES_CATEGORIES = require('./chat-languages-categories');

const chatSchema = new mongoose.Schema({
  room: {
    type: String,
    unique: true,
    required: [true, 'Room is required']
  },
  users: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Creator is required'],
    ref: 'User'
  },
  original_language: {
    type: String,
    enum: LANGUAGES_CATEGORIES,
    required: [true, 'Original language is required'],
    default: "en"
  },
  language: {
    type: String,
    enum: LANGUAGES_CATEGORIES,
    required: [true, 'Language is required'],
    default: "en"
  },
  original_text: {
    type: String
  },  
  text: {
    type: String
  },
  time: {
    type: String
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