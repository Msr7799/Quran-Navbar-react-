const express = require('express');
const router = express.Router();
const QuranController = require('../controllers/quranController');

// Get surahs list
router.get('/surahs', QuranController.getAllSurahs);

// Get specific surah
router.get('/surahs/:surahId', QuranController.getSurahById);

// Get page by number
router.get('/pages/:pageNumber', QuranController.getQuranPage);

// Get tafsir for a specific verse
router.get('/tafsir/:surahId/:verseId', QuranController.getTafsir);

// Get all tafsir for a specific surah
router.get('/tafsir/:surahId', QuranController.getSurahTafsir);

// Get audio recitations for a surah
router.get('/audio/:surahId', QuranController.getSurahAudio);

// Get reciter details
router.get('/reciters', QuranController.getAllReciters);

module.exports = router;
