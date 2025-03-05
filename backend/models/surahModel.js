const mongoose = require('mongoose');

const verseSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  text: {
    ar: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    }
  },
  juz: {
    type: Number,
    required: true
  },
  page: {
    type: Number,
    required: true
  },
  sajda: {
    type: Boolean,
    default: false
  }
});

const reciterSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  reciter: {
    ar: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    }
  },
  rewaya: {
    ar: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    }
  },
  server: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
});

const surahSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    ar: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    },
    transliteration: {
      type: String,
      required: true
    }
  },
  revelation_place: {
    ar: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    }
  },
  verses_count: {
    type: Number,
    required: true
  },
  words_count: {
    type: Number,
    required: true
  },
  letters_count: {
    type: Number,
    required: true
  },
  verses: [verseSchema],
  audio: [reciterSchema]
});

// تعديل اسم المجموعة لمطابقة اسم المجموعة التي تحتوي على بيانات كاملة (114 سورة)
const SurahModel = mongoose.model('Surah', surahSchema, 'FULL-DATA');
console.log(`Model 'Surah' will use collection: ${SurahModel.collection.name}`);

module.exports = SurahModel;
