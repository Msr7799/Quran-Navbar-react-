const mongoose = require('mongoose');

const tafsirSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  sura: {
    type: Number,
    required: true
  },
  aya: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

// Create a compound index on sura and aya for faster queries
tafsirSchema.index({ sura: 1, aya: 1 });

// استخدام اسم الجمع 'tafseer' في قاعدة البيانات
const TafsirModel = mongoose.model('Tafsir', tafsirSchema, 'tafseer'); // Use 'tafseer' as the collection name
console.log(
  `Model 'Tafsir' will use collection: ${TafsirModel.collection.name}`
);

module.exports = TafsirModel;
