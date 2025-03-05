const Bookmark = require('../../models/bookmarkModel');

// Get all bookmarks
const getAllBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({});
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a bookmark
const createBookmark = async (req, res) => {
  try {
    const { surahId, verseId, userId } = req.body;

    // Validate required fields
    if (!surahId || !verseId || !userId) {
      return res
        .status(400)
        .json({ message: 'Please provide surahId, verseId and userId' });
    }

    const newBookmark = new Bookmark({
      surahId: parseInt(surahId),
      verseId: parseInt(verseId),
      userId
    });

    const savedBookmark = await newBookmark.save();
    res.status(201).json(savedBookmark);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a bookmark
const deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBookmark = await Bookmark.findByIdAndDelete(id);

    if (!deletedBookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: `Bookmark deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBookmarks,
  createBookmark,
  deleteBookmark
};
