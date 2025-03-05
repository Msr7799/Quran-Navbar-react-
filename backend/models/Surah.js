const mongoose = require('mongoose');

// نموذج الآية
const VerseSchema = new mongoose.Schema({
  number: Number,
  text: {
    ar: String,
    en: String
  },
  juz: Number,
  page: Number,
  sajda: Boolean
});

// نموذج السورة
const SurahSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    revelation_place: String,
    verses_count: String,
    words_count: String,
    letters_count: String,
    verses: {
      type: [VerseSchema],
      default: []
    },
    audio: {
      type: Array,
      default: []
    }
  },
  {
    strict: false // للسماح بحفظ البيانات بالصيغة الموجودة
  }
);

// يتم تحويل السلاسل النصية التي تحتوي على JSON إلى كائنات عند استرجاعها
SurahSchema.pre('find', function () {
  this.transform((doc, ret) => {
    try {
      if (ret.name && typeof ret.name === 'string') {
        ret.name = JSON.parse(ret.name);
      }
      if (ret.revelation_place && typeof ret.revelation_place === 'string') {
        ret.revelation_place = JSON.parse(ret.revelation_place);
      }
      if (ret.verses && typeof ret.verses === 'string') {
        ret.verses = JSON.parse(ret.verses);
      }
      if (ret.audio && typeof ret.audio === 'string') {
        ret.audio = JSON.parse(ret.audio);
      }
    } catch (e) {
      console.error('Error parsing JSON string:', e);
    }
    return ret;
  });
});

const Surah = mongoose.model('Surah', SurahSchema, 'quranData');

module.exports = Surah;
