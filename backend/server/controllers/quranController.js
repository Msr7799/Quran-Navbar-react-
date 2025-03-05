const Surah = require('../../models/surahModel');
const Tafsir = require('../../models/tafsirModel');

// Get all surahs
const getAllSurahs = async (req, res) => {
  try {
    console.log('Collection name:', Surah.collection.name);
    console.log('Executing getAllSurahs query...');

    // First, check if there are any documents at all
    const count = await Surah.countDocuments();
    console.log(`Total documents in collection: ${count}`);

    const surahs = await Surah.find(
      {},
      {
        number: 1,
        'name.ar': 1,
        'name.en': 1,
        'name.transliteration': 1,
        verses_count: 1,
        revelation_place: 1
      }
    );

    console.log(`Found ${surahs.length} surahs`);

    res.json(surahs);
  } catch (error) {
    console.error('Error in getAllSurahs:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get a specific surah by ID
const getSurahById = async (req, res) => {
  try {
    const { surahId } = req.params;
    const surah = await Surah.findOne({ number: parseInt(surahId) });

    if (!surah) {
      return res.status(404).json({ message: 'Surah not found' });
    }

    res.json(surah);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific page of the Quran
const getQuranPage = async (req, res) => {
  try {
    const { pageNumber } = req.params;
    const page = parseInt(pageNumber);

    // Find all verses on this page
    const surahs = await Surah.find({
      'verses.page': page
    });

    // Extract only the verses for this page
    const pageData = {
      pageNumber: page,
      surahs: surahs.map(surah => ({
        id: surah.number,
        name: surah.name,
        verses: surah.verses.filter(verse => verse.page === page)
      }))
    };

    res.json(pageData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tafsir for a specific verse
const getTafsir = async (req, res) => {
  try {
    const { surahId, verseId } = req.params;
    const surahNumber = parseInt(surahId);
    const ayaNumber = parseInt(verseId);

    console.log(
      `Looking up tafsir for surah ${surahNumber}, ayah ${ayaNumber}`
    );

    // Find the tafsir in the tafseer collection
    const tafsir = await Tafsir.findOne({
      sura: surahNumber,
      aya: ayaNumber
    });

    if (!tafsir) {
      console.log('Tafsir not found in database, returning placeholder');
      return res.status(200).json({
        surahId: surahNumber,
        verseId: ayaNumber,
        text: 'تفسير غير متوفر لهذه الآية' // Placeholder text when tafsir is not available
      });
    }

    console.log('Tafsir found:', tafsir.text.substring(0, 50) + '...');

    res.json({
      surahId: surahNumber,
      verseId: ayaNumber,
      text: tafsir.text
    });
  } catch (error) {
    console.error('Error in getTafsir:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all tafsir for a specific surah
const getSurahTafsir = async (req, res) => {
  try {
    const { surahId } = req.params;
    const surahNumber = parseInt(surahId);

    console.log(`Getting all tafsir for surah ${surahNumber}`);

    const tafsirs = await Tafsir.find({ sura: surahNumber }).sort({ aya: 1 });

    if (!tafsirs || tafsirs.length === 0) {
      return res
        .status(404)
        .json({ message: 'No tafsir found for this surah' });
    }

    console.log(
      `Found ${tafsirs.length} tafsir entries for surah ${surahNumber}`
    );

    res.json(tafsirs);
  } catch (error) {
    console.error('Error in getSurahTafsir:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get audio recitations for a surah
const getSurahAudio = async (req, res) => {
  try {
    const { surahId } = req.params;
    const surah = await Surah.findOne(
      { number: parseInt(surahId) },
      { audio: 1 }
    );

    if (!surah) {
      return res.status(404).json({ message: 'Surah not found' });
    }

    res.json(surah.audio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reciters
const getAllReciters = async (req, res) => {
  try {
    // This aggregation gets unique reciters across all surahs
    const reciters = await Surah.aggregate([
      { $unwind: '$audio' },
      {
        $group: {
          _id: '$audio.id',
          reciter: { $first: '$audio.reciter' },
          rewaya: { $first: '$audio.rewaya' },
          server: { $first: '$audio.server' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(reciters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSurahs,
  getSurahById,
  getQuranPage,
  getTafsir,
  getSurahAudio,
  getAllReciters,
  getSurahTafsir // Add the new method
};
