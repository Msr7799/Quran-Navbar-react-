const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/searchController');

// البحث في نص القرآن
router.get('/quran/:query', SearchController.searchQuran);

// البحث في التفاسير
router.get('/tafsir/:query', SearchController.searchTafsir);

// البحث الشامل في القرآن والتفاسير
router.get('/all/:query', SearchController.searchAll);

// البحث في صفحة محددة
router.get('/page/:pageNumber', SearchController.searchPage);

module.exports = router;
