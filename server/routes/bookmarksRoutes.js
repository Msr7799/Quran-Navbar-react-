const express = require('express');
const router = express.Router();
const BookmarkController = require('../controllers/bookmarkController');

// Get all bookmarks
router.get('/', BookmarkController.getAllBookmarks);

// Create a bookmark
router.post('/', BookmarkController.createBookmark);

// Delete a bookmark
router.delete('/:id', BookmarkController.deleteBookmark);

module.exports = router;
