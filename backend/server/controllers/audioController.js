const Surah = require('../../models/surahModel');

// الحصول على جميع القراء المتاحين
const getAllReciters = async (req, res) => {
  try {
    // استخدام التجميع للحصول على قائمة فريدة من القراء عبر جميع السور
    const reciters = await Surah.aggregate([
      // فك مصفوفة الصوتيات
      { $unwind: '$audio' },
      // تجميع القراء الفريدين
      {
        $group: {
          _id: '$audio.id',
          reciter: { $first: '$audio.reciter' },
          rewaya: { $first: '$audio.rewaya' },
          server: { $first: '$audio.server' }
        }
      },
      // ترتيب حسب المعرف
      { $sort: { _id: 1 } }
    ]);

    res.json(reciters);
  } catch (error) {
    console.error('Error in getAllReciters:', error);
    res.status(500).json({ message: error.message });
  }
};

// الحصول على جميع الروايات المتاحة
const getAllRewayat = async (req, res) => {
  try {
    // استخدام التجميع للحصول على قائمة فريدة من الروايات
    const rewayat = await Surah.aggregate([
      // فك مصفوفة الصوتيات
      { $unwind: '$audio' },
      // تجميع الروايات الفريدة
      {
        $group: {
          _id: '$audio.rewaya.ar',
          rewaya_ar: { $first: '$audio.rewaya.ar' },
          rewaya_en: { $first: '$audio.rewaya.en' },
          count: { $sum: 1 }
        }
      },
      // ترتيب حسب الاسم العربي
      { $sort: { rewaya_ar: 1 } }
    ]);

    res.json(rewayat);
  } catch (error) {
    console.error('Error in getAllRewayat:', error);
    res.status(500).json({ message: error.message });
  }
};

// الحصول على تلاوات قارئ محدد
const getReciterAudio = async (req, res) => {
  try {
    const { reciterId } = req.params;

    // البحث عن التلاوات المتاحة للقارئ المحدد
    const surahsWithAudio = await Surah.aggregate([
      // فك مصفوفة الصوتيات
      { $unwind: '$audio' },
      // تصفية حسب معرف القارئ
      { $match: { 'audio.id': parseInt(reciterId) } },
      // اختيار الحقول المطلوبة فقط
      {
        $project: {
          _id: 0,
          surah_number: '$number',
          surah_name: '$name',
          reciter: '$audio.reciter',
          rewaya: '$audio.rewaya',
          audio_link: '$audio.link'
        }
      },
      // ترتيب حسب رقم السورة
      { $sort: { surah_number: 1 } }
    ]);

    if (surahsWithAudio.length === 0) {
      return res.status(404).json({ message: 'لا توجد تلاوات للقارئ المحدد' });
    }

    res.json(surahsWithAudio);
  } catch (error) {
    console.error('Error in getReciterAudio:', error);
    res.status(500).json({ message: error.message });
  }
};

// الحصول على تلاوات سورة محددة بحسب رواية محددة
const getSurahByRewaya = async (req, res) => {
  try {
    const { surahId, rewaya } = req.params;

    // البحث عن السورة
    const surah = await Surah.findOne({ number: parseInt(surahId) });

    if (!surah) {
      return res.status(404).json({ message: 'السورة غير موجودة' });
    }

    // تصفية القراء حسب الرواية المطلوبة
    const filteredAudio = surah.audio.filter(
      audio =>
        audio.rewaya.ar.includes(rewaya) || audio.rewaya.en.includes(rewaya)
    );

    if (filteredAudio.length === 0) {
      return res
        .status(404)
        .json({ message: 'لا توجد تلاوات بهذه الرواية للسورة المحددة' });
    }

    res.json({
      surah: {
        number: surah.number,
        name: surah.name
      },
      audio: filteredAudio
    });
  } catch (error) {
    console.error('Error in getSurahByRewaya:', error);
    res.status(500).json({ message: error.message });
  }
};

// البحث عن قراء بالاسم
const searchReciters = async (req, res) => {
  try {
    const { query } = req.params;

    // البحث في كافة القراء
    const matchingReciters = await Surah.aggregate([
      // فك مصفوفة الصوتيات
      { $unwind: '$audio' },
      // تصفية حسب اسم القارئ
      {
        $match: {
          $or: [
            { 'audio.reciter.ar': { $regex: query, $options: 'i' } },
            { 'audio.reciter.en': { $regex: query, $options: 'i' } }
          ]
        }
      },
      // تجميع القراء الفريدين
      {
        $group: {
          _id: '$audio.id',
          reciter: { $first: '$audio.reciter' },
          rewaya: { $first: '$audio.rewaya' },
          server: { $first: '$audio.server' }
        }
      },
      // ترتيب حسب المعرف
      { $sort: { _id: 1 } }
    ]);

    res.json(matchingReciters);
  } catch (error) {
    console.error('Error in searchReciters:', error);
    res.status(500).json({ message: error.message });
  }
};

// الحصول على قائمة بالأجزاء والصفحات لتسهيل تصفح القرآن
const getQuranNavigation = async (req, res) => {
  try {
    // تجميع معلومات الأجزاء والصفحات
    const juzInfo = await Surah.aggregate([
      // فك مصفوفة الآيات
      { $unwind: '$verses' },
      // تجميع حسب الجزء
      {
        $group: {
          _id: '$verses.juz',
          juz_number: { $first: '$verses.juz' },
          pages: { $addToSet: '$verses.page' },
          surahs: {
            $addToSet: {
              number: '$number',
              name: '$name'
            }
          }
        }
      },
      // ترتيب حسب رقم الجزء
      { $sort: { juz_number: 1 } }
    ]);

    // تنظيم البيانات بشكل أفضل
    const formattedJuzInfo = juzInfo.map(juz => ({
      juz_number: juz.juz_number,
      pages: juz.pages.sort((a, b) => a - b),
      surahs: juz.surahs
    }));

    res.json(formattedJuzInfo);
  } catch (error) {
    console.error('Error in getQuranNavigation:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllReciters,
  getAllRewayat,
  getReciterAudio,
  getSurahByRewaya,
  searchReciters,
  getQuranNavigation
};
