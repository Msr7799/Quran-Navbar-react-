import React from 'react';
import { Link } from 'react-router-dom';
import {
  Book,
  Radio,
  Bookmark,
  Search,
  Compass,
  BookOpen,
  Tv,
  Mic,
  Home,
  BarChart3,
  Settings
} from 'lucide-react';
import { useTheme } from '../ThemeContext';

const QuickLinks = () => {
  const { state } = useTheme();
  const isDarkMode = state.theme === 'dark';

  return (
    <div className="bg-base-200 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <BarChart3 size={20} className="ml-2" />
        الوصول السريع
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center bg-base-100 p-3 rounded-lg hover:bg-primary/10 transition-colors ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          <Home size={24} className="mb-2 text-primary" />
          <span className="text-center text-sm">الرئيسية</span>
        </Link>

        <Link
          to="/quran/index"
          className={`flex flex-col items-center justify-center bg-base-100 p-3 rounded-lg hover:bg-primary/10 transition-colors ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          <Book size={24} className="mb-2 text-primary" />
          <span className="text-center text-sm">فهرس السور</span>
        </Link>

        <Link
          to="/search"
          className={`flex flex-col items-center justify-center bg-base-100 p-3 rounded-lg hover:bg-primary/10 transition-colors ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          <Search size={24} className="mb-2 text-primary" />
          <span className="text-center text-sm">البحث</span>
        </Link>

        <Link
          to="/bookmarks"
          className={`flex flex-col items-center justify-center bg-base-100 p-3 rounded-lg hover:bg-primary/10 transition-colors ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          <Bookmark size={24} className="mb-2 text-primary" />
          <span className="text-center text-sm">المفضلة</span>
        </Link>

        <Link
          to="/qibla"
          className={`flex flex-col items-center justify-center bg-base-100 p-3 rounded-lg hover:bg-primary/10 transition-colors ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          <Compass size={24} className="mb-2 text-primary" />
          <span className="text-center text-sm">القبلة</span>
        </Link>

        <Link
          to="/radio"
          className={`flex flex-col items-center justify-center bg-base-100 p-3 rounded-lg hover:bg-primary/10 transition-colors ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          <Radio size={24} className="mb-2 text-primary" />
          <span className="text-center text-sm">الإذاعات</span>
        </Link>

        <Link
          to="/quran/pages"
          className={`flex flex-col items-center justify-center bg-base-100 p-3 rounded-lg hover:bg-primary/10 transition-colors ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          <BookOpen size={24} className="mb-2 text-primary" />
          <span className="text-center text-sm">المصحف</span>
        </Link>

        <Link
          to="/tv"
          className={`flex flex-col items-center justify-center bg-base-100 p-3 rounded-lg hover:bg-primary/10 transition-colors ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          <Tv size={24} className="mb-2 text-primary" />
          <span className="text-center text-sm">البث المباشر</span>
        </Link>

        <Link
          to="/player/1"
          className={`flex flex-col items-center justify-center bg-base-100 p-3 rounded-lg hover:bg-primary/10 transition-colors ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          <Mic size={24} className="mb-2 text-primary" />
          <span className="text-center text-sm">الاستماع</span>
        </Link>

        <Link
          to="/settings"
          className={`flex flex-col items-center justify-center bg-base-100 p-3 rounded-lg hover:bg-primary/10 transition-colors ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          <Settings size={24} className="mb-2 text-primary" />
          <span className="text-center text-sm">الإعدادات</span>
        </Link>
      </div>
    </div>
  );
};

export default QuickLinks;
