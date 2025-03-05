import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeContext';
import {
  Menu,
  X,
  Sun,
  Moon,
  Book,
  Radio,
  Search,
  Settings,
  Home,
  Info,
  Tv,
  Bookmark
} from 'lucide-react';

const QuranNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { state, dispatch } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  // إغلاق القائمة عند الانتقال بين الصفحات
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // تغيير مظهر النافبار عند التمرير
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // تفعيل الوضع المظلم والفاتح
  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  // تأثير الحركة للقائمة المتنقلة
  const menuVariants = {
    closed: {
      opacity: 0,
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  };

  const menuItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  // تكوين العناصر في القائمة
  const navItems = [
    { to: '/', text: 'الرئيسية', icon: <Home size={20} /> },
    { to: '/quran/pages', text: 'المصحف', icon: <Book size={20} /> },
    { to: '/player', text: 'مشغل القرآن', icon: <Radio size={20} /> },
    { to: '/quran/index', text: 'فهرس السور', icon: <Menu size={20} /> },
    { to: '/search', text: 'البحث', icon: <Search size={20} /> },
    { to: '/bookmarks', text: 'المفضلة', icon: <Bookmark size={20} /> },
    { to: '/quran-radio', text: 'الإذاعات', icon: <Radio size={20} /> },
    { to: '/live', text: 'قنوات مباشرة', icon: <Tv size={20} /> },
    { to: '/settings', text: 'الإعدادات', icon: <Settings size={20} /> },
    { to: '/about', text: 'عن التطبيق', icon: <Info size={20} /> }
  ];

  return (
    <nav
      className={`
        sticky top-0 z-50 w-full backdrop-blur-md 
        transition-all duration-300
        ${isScrolled ? 'bg-base-100/90 shadow-md' : 'bg-base-100/70'}
      `}
    >
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-16">
          {/* زر القائمة للموبايل */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-base-200 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* الشعار */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <motion.img
                src="/logo.png"
                alt="Quran Logo"
                className="h-8 w-auto"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
              <motion.span
                className="font-bold text-lg ml-2 hidden md:block"
                whileHover={{ scale: 1.05 }}
              >
                القرآن الكريم
              </motion.span>
            </Link>
          </div>

          {/* القائمة للشاشات الكبيرة */}
          <div className="hidden lg:block">
            <div className="flex space-x-4 ml-4 items-center">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                     ${
                       isActive
                         ? 'bg-primary text-primary-content'
                         : 'hover:bg-base-200'
                     }`
                  }
                >
                  <span className="ml-1">{item.icon}</span>
                  <span>{item.text}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* زر الوضع المظلم والفاتح */}
          <div className="flex items-center">
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-base-200"
            >
              {state.isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* القائمة المتنقلة للشاشات الصغيرة */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-y-0 right-0 w-64 bg-base-100 shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-4">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex justify-between items-center mb-5"
              >
                <span className="font-bold text-xl">القائمة</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-base-200"
                >
                  <X size={20} />
                </button>
              </motion.div>

              <div className="space-y-1">
                {navItems.map(item => (
                  <motion.div key={item.to} variants={menuItemVariants}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-3 rounded-md font-medium transition-colors
                        ${
                          isActive
                            ? 'bg-primary text-primary-content'
                            : 'hover:bg-base-200'
                        }`
                      }
                    >
                      <span className="ml-3">{item.icon}</span>
                      <span>{item.text}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              <motion.div
                variants={menuItemVariants}
                className="mt-10 p-3 bg-base-200 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <span>الوضع المظلم</span>
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-base-300"
                  >
                    {state.isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* خلفية شفافة للضغط خارج القائمة */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </nav>
  );
};

export default QuranNavbar;
