import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Book,
  Bookmark,
  Search,
  Radio,
  Compass,
  Play,
  Clock,
  BarChart3,
  BookOpen,
  ChevronLeft
} from 'lucide-react';
import { useTheme } from '../ThemeContext';

const HomePage = () => {
  const { state } = useTheme();
  const [randomVerse, setRandomVerse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    completed: 0,
    bookmarks: state.bookmarks.length || 0,
    lastRead: state.lastRead || null
  });

  // جلب آية عشوائية عند تحميل الصفحة
  useEffect(() => {
    const fetchRandomVerse = async () => {
      try {
        setIsLoading(true);
        const randomSurah = Math.floor(Math.random() * 114) + 1;

        // جلب بيانات السورة
        const surahResponse = await fetch(`/data/quran/${randomSurah}.json`);
        const surahData = await surahResponse.json();

        // اختيار آية عشوائية من السورة
        const randomVerseIndex = Math.floor(
          Math.random() * surahData.verses.length
        );
        const verse = surahData.verses[randomVerseIndex];

        setRandomVerse({
          text: verse.text,
          surahName: surahData.name,
          surahNumber: randomSurah,
          verseNumber: randomVerseIndex + 1
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching random verse:', error);
        setIsLoading(false);
      }
    };

    fetchRandomVerse();
  }, []);

  // المكونات الفرعية للصفحة الرئيسية
  const RecentActivity = () => {
    return (
      <div className="bg-base-200 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Clock size={20} className="ml-2" />
          آخر نشاط
        </h2>

        {state.lastRead ? (
          <Link to={`/reader/${state.lastRead.surah}`} className="group">
            <div className="bg-base-100 rounded-lg p-4 mb-2 hover:bg-primary/10 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">آخر قراءة</h3>
                  <p className="text-base-content/70 text-sm">
                    سورة {state.lastRead.surahName} • الآية{' '}
                    {state.lastRead.verse}
                  </p>
                </div>
                <ChevronLeft
                  size={18}
                  className="opacity-60 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-base-100 rounded-lg p-4 mb-2">
            <p className="text-base-content/60 text-center">
              لا يوجد نشاط حديث
            </p>
          </div>
        )}

        {state.history && state.history.length > 0
          ? state.history.slice(0, 3).map((item, index) => (
              <Link
                to={`/reader/${item.surah || item.id}`}
                key={index}
                className="group"
              >
                <div className="bg-base-100 rounded-lg p-3 mb-2 hover:bg-primary/10 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">
                        {item.surahName || `سورة ${item.surah}`}
                      </h3>
                      <p className="text-base-content/70 text-sm">
                        {item.timestamp
                          ? new Date(item.timestamp).toLocaleDateString('ar-SA')
                          : ''}
                      </p>
                    </div>
                    <ChevronLeft
                      size={18}
                      className="opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              </Link>
            ))
          : null}

        <Link to="/bookmarks" className="btn btn-ghost btn-sm btn-block mt-4">
          عرض جميع النشاطات
        </Link>
      </div>
    );
  };

  const QuickStats = () => {
    return (
      <div className="bg-base-200 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <BarChart3 size={20} className="ml-2" />
          إحصائيات
        </h2>

        <div className="stats stats-vertical bg-base-100 shadow w-full">
          <div className="stat">
            <div className="stat-title">إجمالي المفضلة</div>
            <div className="stat-value text-primary">{stats.bookmarks}</div>
          </div>

          <div className="stat">
            <div className="stat-title">تقدم القراءة</div>
            <div className="stat-value text-primary">{stats.completed}%</div>
            <div className="stat-desc">
              <progress
                className="progress progress-primary w-full"
                value={stats.completed}
                max="100"
              ></progress>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FeaturedVerse = () => {
    if (isLoading) {
      return (
        <div className="bg-base-200 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">آية اليوم</h2>
          <div className="bg-base-100 rounded-lg p-6 flex justify-center items-center min-h-[200px]">
            <span className="loading loading-dots loading-lg text-primary"></span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-base-200 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">آية اليوم</h2>

        {randomVerse && (
          <div className="bg-base-100 rounded-lg p-6">
            <p className="text-2xl font-quran text-center leading-loose mb-6">
              {randomVerse.text}
            </p>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-base-content/70">{randomVerse.surahName}</p>
                <p className="text-base-content/60 text-sm">
                  الآية {randomVerse.verseNumber}
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/reader/${randomVerse.surahNumber}?verse=${randomVerse.verseNumber}`}
                  className="btn btn-sm btn-primary"
                >
                  <BookOpen size={16} className="ml-1" />
                  قراءة
                </Link>

                <button className="btn btn-sm btn-outline">
                  <Play size={16} className="ml-1" />
                  استماع
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const QuickAccess = () => {
    return (
      <div className="bg-base-200 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">وصول سريع</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Link
            to="/quran/index"
            className="flex flex-col items-center justify-center bg-base-100 p-4 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <Book size={24} className="mb-2 text-primary" />
            <span className="text-center">فهرس السور</span>
          </Link>

          <Link
            to="/search"
            className="flex flex-col items-center justify-center bg-base-100 p-4 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <Search size={24} className="mb-2 text-primary" />
            <span className="text-center">البحث</span>
          </Link>

          <Link
            to="/bookmarks"
            className="flex flex-col items-center justify-center bg-base-100 p-4 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <Bookmark size={24} className="mb-2 text-primary" />
            <span className="text-center">المفضلة</span>
          </Link>

          <Link
            to="/qibla"
            className="flex flex-col items-center justify-center bg-base-100 p-4 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <Compass size={24} className="mb-2 text-primary" />
            <span className="text-center">اتجاه القبلة</span>
          </Link>

          <Link
            to="/radio"
            className="flex flex-col items-center justify-center bg-base-100 p-4 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <Radio size={24} className="mb-2 text-primary" />
            <span className="text-center">الإذاعات</span>
          </Link>

          <Link
            to="/quran/pages"
            className="flex flex-col items-center justify-center bg-base-100 p-4 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <BookOpen size={24} className="mb-2 text-primary" />
            <span className="text-center">المصحف</span>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold mb-2">القرآن الكريم</h1>
        <p className="text-base-content/70 max-w-2xl mx-auto">
          "إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ"
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <FeaturedVerse />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <RecentActivity />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <QuickStats />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <QuickAccess />
      </motion.div>
    </div>
  );
};

export default HomePage;
