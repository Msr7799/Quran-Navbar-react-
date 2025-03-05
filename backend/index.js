const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import routes
const quranRoutes = require('./server/routes/quranRoutes');
const bookmarksRoutes = require('./server/routes/bookmarksRoutes');
const searchRoutes = require('./server/routes/searchRoutes');
const audioRoutes = require('./server/routes/audioRoutes'); // المسار الجديد للصوتيات

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/quran', quranRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/audio', audioRoutes); // إضافة المسار الجديد للصوتيات

// Basic root route
app.get('/', (req, res) => {
  res.send('Quran API server is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
