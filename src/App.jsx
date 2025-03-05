import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import HomePage from './Components/HomePage';
import QuranIndex from './Components/QuranIndex';
import QuranPages from './Components/QuranPages';
import QuranReader from './Components/QuranReader';
import QiblaPage from './Components/QiblaPage';
import BookmarksPage from './Components/BookmarksPage';
import QuranRadio from './Components/QuranRadio';
import SearchPage from './Components/SearchPage';
import SearchResults from './Components/SearchResults';
import AboutPage from './Components/AboutPage';
import NotFound from './Components/NotFound';
import QuranPlayer from './Components/QuranPlayer';
import LiveTV from './Components/LiveTV';
import QuranTafsir from './Components/QuranTafsir';
import QuranViewerSimple from './Components/QuranViewerSimple';
import Radio from './Components/Radio';
import QuranPageFlip from './Components/QuranPageFlip';
import Settings from './Components/Settings';
import './App.css';

function App() {
  // تهيئة السمة من التخزين المحلي
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      if (savedTheme.includes('dark')) {
        document.documentElement.classList.add('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-base-100 text-base-content rtl">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quran/index" element={<QuranIndex />} />
              <Route path="/quran/pages" element={<QuranPages />} />
              <Route path="/reader/:surahId" element={<QuranReader />} />
              <Route path="/qibla" element={<QiblaPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/radio" element={<QuranRadio />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/search/:query" element={<SearchResults />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/player/:surahId" element={<QuranPlayer />} />
              <Route path="/tv" element={<LiveTV />} />
              <Route path="/tafsir/:surahId" element={<QuranTafsir />} />
              <Route
                path="/viewer/:surahId/:verseId"
                element={<QuranViewerSimple />}
              />
              <Route path="/radio/:stationId" element={<Radio />} />
              <Route path="/pageflip/:pageNumber" element={<QuranPageFlip />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
