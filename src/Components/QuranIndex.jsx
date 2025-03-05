import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  BookOpen,
  Filter,
  X,
  Volume2,
  Pause,
  Play,
  Download
} from 'lucide-react';
import { useTheme } from '../ThemeContext';

const QuranIndex = () => {
  const { state } = useTheme();
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'meccan', 'medinan'
  const [currentPlayingSurah, setCurrentPlayingSurah] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const navigate = useNavigate();

  // جلب بيانات السور من API
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.quran.com/api/v4/chapters');
        if (!response.ok) {
          throw new Error('فشل في تحميل البيانات');
        }
        const data = await response.json();
        setSurahs(data.chapters);
        setLoading(false);
      } catch (err) {
        console.error('Error loading Surah index:', err);
        setError('حدث خطأ أثناء تحميل فهرس السور. يرجى المحاولة مرة أخرى.');
        setLoading(false);
      }
    };

    fetchSurahs();

    // تنظيف الصوت عند مغادرة الصفحة
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // إيقاف الصوت عند تغيير السورة
  useEffect(() => {
    if (currentPlayingSurah && audioRef.current) {
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentPlayingSurah(null);
      };
    }
  }, [currentPlayingSurah]);

  // تشغيل السورة من صوت القارئ المختار
  const playSurah = async surahId => {
    try {
      const reciterId = state.reciterVoice.id || '7'; // الافتراضي هو مشاري العفاسي

      // إيقاف الصوت الحالي إذا كان يعمل
      if (isPlaying) {
        audioRef.current.pause();

        // إذا تم النقر على نفس السورة، نقوم فقط بالإيقاف
        if (currentPlayingSurah === surahId) {
          setIsPlaying(false);
          setCurrentPlayingSurah(null);
          return;
        }
      }

      setCurrentPlayingSurah(surahId);

      // تجهيز الرابط (URL) للصوت
      const audioUrl = `https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${surahId}`;

      audioRef.current.src = audioUrl;
      audioRef.current.load();

      // تشغيل عند اكتمال التحميل
      audioRef.current.oncanplaythrough = () => {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.error('Error playing audio:', err);
            setIsPlaying(false);
          });
      };
    } catch (err) {
      console.error('Error playing surah:', err);
      setIsPlaying(false);
      setCurrentPlayingSurah(null);
    }
  };

  // الانتقال إلى صفحة القراءة والاستماع
  const goToPlayer = surahId => {
    navigate(`/player/${surahId}`);
  };

  // تصفية السور بناء على البحث والفلتر
  const filteredSurahs = surahs.filter(surah => {
    const matchesSearch =
      surah.name_arabic.includes(searchTerm) ||
      surah.name_simple.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.id.toString().includes(searchTerm) ||
      surah.name_complex.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'meccan' && surah.revelation_place === 'makkah') ||
      (filterType === 'medinan' && surah.revelation_place === 'madinah');

    return matchesSearch && matchesFilter;
  });

  // تعريف الحركة للعناصر
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4 text-base-content/70">جاري تحميل فهرس السور...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary mt-4"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-center mb-2">
          فهرس سور القرآن الكريم
        </h1>
        <p className="text-base-content/70 text-center max-w-2xl mx-auto">
          استمع إلى القرآن الكريم بصوت القارئ{' '}
          {state.reciterVoice.name || 'مشاري راشد العفاسي'}
        </p>
      </motion.div>

      {/* شريط البحث والتصفية */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search size={18} className="text-base-content/40" />
            </div>
            <input
              type="text"
              placeholder="ابحث باسم السورة أو رقمها..."
              className="input input-bordered w-full pr-10 rtl:pr-10 rtl:pl-4"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 left-0 flex items-center pl-3"
                onClick={() => setSearchTerm('')}
              >
                <X size={16} className="text-base-content/40" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <div className="join">
              <button
                className={`join-item btn ${
                  filterType === 'all' ? 'btn-primary' : 'btn-outline'
                }`}
                onClick={() => setFilterType('all')}
              >
                الكل
              </button>
              <button
                className={`join-item btn ${
                  filterType === 'meccan' ? 'btn-primary' : 'btn-outline'
                }`}
                onClick={() => setFilterType('meccan')}
              >
                مكية
              </button>
              <button
                className={`join-item btn ${
                  filterType === 'medinan' ? 'btn-primary' : 'btn-outline'
                }`}
                onClick={() => setFilterType('medinan')}
              >
                مدنية
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* قائمة السور */}
      {filteredSurahs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-xl text-base-content/70">
            لا توجد نتائج مطابقة للبحث
          </p>
          <button
            className="btn btn-outline mt-4"
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
            }}
          >
            إعادة ضبط البحث
          </button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredSurahs.map(surah => (
            <motion.div
              key={surah.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="bg-base-200 rounded-lg overflow-hidden shadow-sm"
            >
              <div className="p-4 hover:bg-primary/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full ml-4">
                      <span className="font-bold text-lg text-primary">
                        {surah.id}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h2 className="font-bold text-xl">{surah.name_arabic}</h2>
                      <div className="flex flex-wrap gap-x-3 text-sm text-base-content/70">
                        <span>
                          {surah.revelation_place === 'makkah'
                            ? 'مكية'
                            : 'مدنية'}
                        </span>
                        <span>•</span>
                        <span>{surah.verses_count} آية</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => playSurah(surah.id)}
                      className={`btn btn-circle btn-sm ${
                        currentPlayingSurah === surah.id && isPlaying
                          ? 'btn-primary'
                          : 'btn-ghost'
                      }`}
                      aria-label={
                        isPlaying && currentPlayingSurah === surah.id
                          ? 'إيقاف'
                          : 'تشغيل'
                      }
                    >
                      {isPlaying && currentPlayingSurah === surah.id ? (
                        <Pause size={18} />
                      ) : (
                        <Play size={18} />
                      )}
                    </button>
                    <Link
                      to={`/reader/${surah.id}`}
                      className="btn btn-circle btn-sm btn-ghost"
                      aria-label="قراءة"
                    >
                      <BookOpen size={18} />
                    </Link>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
                  <span className="text-sm text-base-content/60">
                    {surah.name_complex}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => goToPlayer(surah.id)}
                      className="btn btn-xs btn-outline"
                    >
                      <Volume2 size={14} className="ml-1" />
                      الاستماع
                    </button>

                    <a
                      href={`https://api.quran.com/api/v4/chapter_recitations/${
                        state.reciterVoice.id || '7'
                      }/${surah.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={`surah_${surah.id}_${
                        state.reciterVoice.name || 'recitation'
                      }.mp3`}
                      className="btn btn-xs btn-ghost"
                      onClick={e => e.stopPropagation()}
                    >
                      <Download size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* معلومات إضافية وإحصائيات */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 pt-6 border-t border-base-300"
      >
        <div className="stats shadow w-full">
          <div className="stat">
            <div className="stat-title">إجمالي السور</div>
            <div className="stat-value text-primary">114</div>
            <div className="stat-desc">في القرآن الكريم</div>
          </div>

          <div className="stat">
            <div className="stat-title">السور المكية</div>
            <div className="stat-value text-primary">86</div>
            <div className="stat-desc">نزلت في مكة المكرمة</div>
          </div>

          <div className="stat">
            <div className="stat-title">السور المدنية</div>
            <div className="stat-value text-primary">28</div>
            <div className="stat-desc">نزلت في المدينة المنورة</div>
          </div>
        </div>
      </motion.div>

      {/* شريط التشغيل في الأسفل */}
      {currentPlayingSurah && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-16 left-0 right-0 z-10 p-4 mx-auto max-w-3xl"
        >
          <div className="bg-base-300 shadow-lg rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => playSurah(currentPlayingSurah)}
                className="btn btn-circle btn-primary mr-4"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <div>
                <div className="font-bold">
                  {
                    filteredSurahs.find(s => s.id === currentPlayingSurah)
                      ?.name_arabic
                  }
                </div>
                <div className="text-sm text-base-content/70">
                  {state.reciterVoice.name || 'مشاري راشد العفاسي'}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => goToPlayer(currentPlayingSurah)}
                className="btn btn-sm btn-outline"
              >
                فتح المشغل
              </button>
              <button
                onClick={() => {
                  audioRef.current.pause();
                  setIsPlaying(false);
                  setCurrentPlayingSurah(null);
                }}
                className="btn btn-sm btn-ghost"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QuranIndex;
