import React, { useEffect, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider, useTheme } from './ThemeContext';
import QuranNavbar from './Components/QuranNavbar';
import Home from './pages/Home';
import Loader from './components/loader/loader';
import './index.css';
const AppContent = () => {
  const { state, dispatch } = useTheme();
  const { theme, isDarkMode } = state;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [theme, isDarkMode]);

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Loader />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/quran' element={<QuranNavbar />} />
          <Route
            path='/quran/pages'
          />
        </Routes>
      </Suspense>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;