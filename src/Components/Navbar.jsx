import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Book,
  Radio,
  Bookmark,
  Search,
  Compass,
  Settings,
  Home,
  Info,
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun,
  BookOpen,
  Tv,
  Mic
} from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state, dispatch } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // تغيير حالة الشريط عند التمرير
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // إغلاق القائمة المتنقلة عند تغيير المسار
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // تبديل وضع السمة بين الفاتح والداكن
  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    dispatch({ type: 'SET_THEME', payload: newTheme });
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const isActive = path => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-base-200 shadow-md' : 'bg-base-100'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* الشعار */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="القرآن الكريم" className="h-8 w-8" />
            <span className="font-bold text-lg hidden sm:block">
              القرآن الكريم
            </span>
          </Link>

          {/* قائمة الروابط للشاشات الكبيرة */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink
              to="/"
              className={`btn btn-ghost btn-sm ${
                isActive('/') ? 'text-primary font-bold' : ''
              }`}
            >
              <Home size={16} />
              <span>الرئيسية</span>
            </NavLink>

            {/* قائمة منسدلة للقرآن */}
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className={`btn btn-ghost btn-sm ${
                  isActive('/quran/index') ||
                  isActive('/quran/pages') ||
                  location.pathname.includes('/reader/')
                    ? 'text-primary font-bold'
                    : ''
                }`}
              >
                <Book size={16} />
                <span>القرآن</span>
                <ChevronDown size={14} />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52 z-10"
              >
                <li>
                  <Link to="/quran/index">فهرس السور</Link>
                </li>
                <li>
                  <Link to="/quran/pages">تصفح بالصفحات</Link>
                </li>
                <li>
                  <Link to="/pageflip/1">المصحف التفاعلي</Link>
                </li>
              </ul>
            </div>

            {/* قائمة منسدلة للاستماع */}
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className={`btn btn-ghost btn-sm ${
                  location.pathname.includes('/player/') ||
                  location.pathname.includes('/radio')
                    ? 'text-primary font-bold'
                    : ''
                }`}
              >
                <Mic size={16} />
                <span>الاستماع</span>
                <ChevronDown size={14} />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52 z-10"
              >
                <li>
                  <Link to="/player/1">المصحف المرتل</Link>
                </li>
                <li>
                  <Link to="/radio">إذاعات القرآن</Link>
                </li>
                <li>
                  <Link to="/tv">البث المباشر</Link>
                </li>
              </ul>
            </div>

            <NavLink
              to="/search"
              className={`btn btn-ghost btn-sm ${
                isActive('/search') ? 'text-primary font-bold' : ''
              }`}
            >
              <Search size={16} />
              <span>البحث</span>
            </NavLink>

            <NavLink
              to="/qibla"
              className={`btn btn-ghost btn-sm ${
                isActive('/qibla') ? 'text-primary font-bold' : ''
              }`}
            >
              <Compass size={16} />
              <span>القبلة</span>
            </NavLink>

            <NavLink
              to="/bookmarks"
              className={`btn btn-ghost btn-sm ${
                isActive('/bookmarks') ? 'text-primary font-bold' : ''
              }`}
            >
              <Bookmark size={16} />
              <span>المفضلة</span>
            </NavLink>

            <NavLink
              to="/about"
              className={`btn btn-ghost btn-sm ${
                isActive('/about') ? 'text-primary font-bold' : ''
              }`}
            >
              <Info size={16} />
              <span>عن التطبيق</span>
            </NavLink>
          </div>

          {/* أزرار التحكم */}
          <div className="flex items-center">
            {/* زر تبديل السمة */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label={
                state.theme === 'light'
                  ? 'التبديل إلى الوضع المظلم'
                  : 'التبديل إلى الوضع المضيء'
              }
            >
              {state.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* زر الإعدادات */}
            <Link
              to="/settings"
              className={`btn btn-ghost btn-sm btn-circle ${
                isActive('/settings') ? 'text-primary' : ''
              }`}
            >
              <Settings size={18} />
            </Link>

            {/* زر القائمة للجوال */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-ghost btn-sm btn-circle lg:hidden"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* القائمة المتنقلة للهواتف */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-base-100 border-t border-base-200 overflow-hidden shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                <Link to="/" className="btn btn-outline btn-sm justify-start">
                  <Home size={16} /> الرئيسية
                </Link>

                <Link
                  to="/quran/index"
                  className="btn btn-outline btn-sm justify-start"
                >
                  <Book size={16} /> فهرس السور
                </Link>

                <Link
                  to="/quran/pages"
                  className="btn btn-outline btn-sm justify-start"
                >
                  <BookOpen size={16} /> تصفح القرآن
                </Link>

                <Link
                  to="/pageflip/1"
                  className="btn btn-outline btn-sm justify-start"
                >
                  <Book size={16} /> المصحف التفاعلي
                </Link>

                <Link
                  to="/player/1"
                  className="btn btn-outline btn-sm justify-start"
                >
                  <Mic size={16} /> المصحف المرتل
                </Link>

                <Link
                  to="/radio"
                  className="btn btn-outline btn-sm justify-start"
                >
                  <Radio size={16} /> الإذاعات
                </Link>

                <Link to="/tv" className="btn btn-outline btn-sm justify-start">
                  <Tv size={16} /> البث المباشر
                </Link>

                <Link
                  to="/search"
                  className="btn btn-outline btn-sm justify-start"
                >
                  <Search size={16} /> البحث
                </Link>

                <Link
                  to="/qibla"
                  className="btn btn-outline btn-sm justify-start"
                >
                  <Compass size={16} /> القبلة
                </Link>

                <Link
                  to="/bookmarks"
                  className="btn btn-outline btn-sm justify-start"
                >
                  <Bookmark size={16} /> المفضلة
                </Link>

                <Link
                  to="/about"
                  className="btn btn-outline btn-sm justify-start"
                >
                  <Info size={16} /> عن التطبيق
                </Link>

                <Link
                  to="/settings"
                  className="btn btn-outline btn-sm justify-start"
                >
                  <Settings size={16} /> الإعدادات
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
