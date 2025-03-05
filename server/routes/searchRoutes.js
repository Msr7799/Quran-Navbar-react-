const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/searchController');

// Search in Quran
router.get('/:query', SearchController.searchQuran);

module.exports = router;
