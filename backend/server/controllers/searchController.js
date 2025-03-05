const Surah = require('../../models/surahModel');
const Tafsir = require('../../models/tafsirModel');

// البحث في نص القرآن
const searchQuran = async (req, res) => {
  try {
    const { query } = req.params;

    // البحث في آيات القرآن
    const results = await Surah.aggregate([
      // فك مصفوفة الآيات
      { $unwind: '$verses' },
      // تصفية حسب نص الآية
      {
        $match: {
          $or: [
            { 'verses.text.ar': { $regex: query, $options: 'i' } },
            { 'verses.text.en': { $regex: query, $options: 'i' } }
          ]
        }
      },
      // تنسيق النتائج
      {
        $project: {
          surah_number: '$number',
          surah_name: '$name',
          verse_number: '$verses.number',
          verse_text: '$verses.text',
          page: '$verses.page',
          juz: '$verses.juz'
        }
      },
      // ترتيب حسب رقم السورة ورقم الآية
      { $sort: { surah_number: 1, verse_number: 1 } },
      // تحديد عدد النتائج
      { $limit: 50 }
    ]);

    res.json(results);
  } catch (error) {
    console.error('Error in searchQuran:', error);
    res.status(500).json({ message: error.message });
  }
};

// البحث في التفاسير
const searchTafsir = async (req, res) => {
  try {
    const { query } = req.params;

    // البحث في التفاسير
    const results = await Tafsir.find(
      { text: { $regex: query, $options: 'i' } },
      { _id: 0, id: 1, sura: 1, aya: 1, text: 1 }
    )
      .sort({ sura: 1, aya: 1 })
      .limit(30);

    res.json(results);
  } catch (error) {
    console.error('Error in searchTafsir:', error);
    res.status(500).json({ message: error.message });
  }
};

// البحث الشامل (في القرآن والتفاسير)
const searchAll = async (req, res) => {
  try {
    const { query } = req.params;

    // البحث في آيات القرآن
    const quranResults = await Surah.aggregate([
      { $unwind: '$verses' },
      {
        $match: {
          $or: [
            { 'verses.text.ar': { $regex: query, $options: 'i' } },
            { 'verses.text.en': { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $project: {
          type: { $literal: 'verse' },
          surah_number: '$number',
          surah_name: '$name',
          verse_number: '$verses.number',
          verse_text: '$verses.text',
          page: '$verses.page'
        }
      },
      { $limit: 20 }
    ]);

    // البحث في التفاسير
    const tafsirResults = await Tafsir.aggregate([
      {
        $match: { text: { $regex: query, $options: 'i' } }
      },
      {
        $project: {
          type: { $literal: 'tafsir' },
          surah_number: '$sura',
          verse_number: '$aya',
          text: '$text'
        }
      },
      { $limit: 10 }
    ]);

    // دمج النتائج
    const combinedResults = {
      query,
      quran_results: quranResults,
      tafsir_results: tafsirResults
    };

    res.json(combinedResults);
  } catch (error) {
    console.error('Error in searchAll:', error);
    res.status(500).json({ message: error.message });
  }
};

// البحث في آيات صفحة محددة
const searchPage = async (req, res) => {
  try {
    const { pageNumber } = req.params;

    // البحث عن جميع الآيات في الصفحة المحددة
    const pageVerses = await Surah.aggregate([
      // فك مصفوفة الآيات
      { $unwind: '$verses' },
      // تصفية حسب رقم الصفحة
      { $match: { 'verses.page': parseInt(pageNumber) } },
      // ترتيب واختيار البيانات المطلوبة
      {
        $project: {
          surah_number: '$number',
          surah_name: '$name',
          verse_number: '$verses.number',
          verse_text: '$verses.text',
          juz: '$verses.juz'
        }
      },
      // ترتيب حسب رقم السورة ورقم الآية
      { $sort: { surah_number: 1, verse_number: 1 } }
    ]);

    if (pageVerses.length === 0) {
      return res
        .status(404)
        .json({ message: 'الصفحة غير موجودة أو لا تحتوي على آيات' });
    }

    const result = {
      page_number: parseInt(pageNumber),
      juz: pageVerses[0].juz, // الجزء الذي تنتمي إليه الصفحة
      verses: pageVerses
    };

    res.json(result);
  } catch (error) {
    console.error('Error in searchPage:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchQuran,
  searchTafsir,
  searchAll,
  searchPage
};
