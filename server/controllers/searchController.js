const searchQuran = async (req, res) => {
  try {
    const { query } = req.params;
    // Mock data - replace with actual search functionality
    const results = [
      {
        surahId: 2,
        verseId: 255,
        text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...'
      },
      { surahId: 112, verseId: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ' }
    ];
    res.json({
      query,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchQuran
};
