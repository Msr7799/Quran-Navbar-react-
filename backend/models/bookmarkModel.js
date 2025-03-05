const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  surahId: {
    type: Number,
    required: true
  },
  verseId: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
