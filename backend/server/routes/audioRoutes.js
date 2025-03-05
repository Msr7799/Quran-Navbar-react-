const express = require('express');
const router = express.Router();
const AudioController = require('../controllers/audioController');

// الحصول على قائمة جميع القراء
router.get('/reciters', AudioController.getAllReciters);

// الحصول على قائمة جميع الروايات
router.get('/rewayat', AudioController.getAllRewayat);

// الحصول على تلاوات قارئ محدد
router.get('/reciters/:reciterId', AudioController.getReciterAudio);

// الحصول على تلاوات سورة محددة برواية محددة
router.get('/surah/:surahId/rewaya/:rewaya', AudioController.getSurahByRewaya);

// البحث عن قراء بالاسم
router.get('/search/:query', AudioController.searchReciters);

// الحصول على معلومات التنقل في القرآن (الأجزاء والصفحات)
router.get('/navigation', AudioController.getQuranNavigation);

module.exports = router;
