const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const quranRoutes = require('./routes/quranRoutes');
const bookmarksRoutes = require('./routes/bookmarksRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB - replace with your actual connection string
mongoose
  .connect('mongodb://localhost:27017/quran_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/quran', quranRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/search', searchRoutes);

// Basic root route
app.get('/', (req, res) => {
  res.send('Quran API server is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
