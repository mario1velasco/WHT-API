const mongoose = require('mongoose');
const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  due_date: Date,
  position: Number,
  list: {
    type: String,
    enum: ['ToDo', 'WorkInProgress', 'Done']
  }
});

module.exports = mongoose.model('Card', cardSchema);
