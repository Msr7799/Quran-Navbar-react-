import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Volume2,
  Search,
  Settings,
  Info,
  Star,
  Pause
} from 'lucide-react';
import { getAllSurahs, getSurahByNumber } from '../services/quranService';

const QuranViewer = () => {
  const { state } = useTheme();
  const { surahNumber = '1' } = useParams();
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState([]);
  const [currentSurah, setCurrentSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState('');
  const [audioElement, setAudioElement] = useState(null);
  const [currentReciter, setCurrentReciter] = useState(null);

  useEffect(() => {
    // جلب قائمة السور
    const fetchSurahs = async () => {
      try {
        const data = await getAllSurahs();
        setSurahs(data);
      } catch (error) {
        console.error('خطأ في جلب قائمة السور:', error);
        setError('حدث خطأ أثناء تحميل قائمة السور.');
      }
    };

    fetchSurahs();

    // إنشاء عنصر الصوت
    const audio = new Audio();
    audio.addEventListener('ended', () => setIsAudioPlaying(false));
    audio.addEventListener('error', () => {
      setIsAudioPlaying(false);
      setError('حدث خطأ أثناء تشغيل الصوت.');
    });

    setAudioElement(audio);

    return () => {
      // تنظيف عنصر الصوت عند إزالة المكون
      if (audio) {
        audio.pause();
        audio.src = '';
        audio.removeEventListener('ended', () => setIsAudioPlaying(false));
        audio.removeEventListener('error', () => {
          setIsAudioPlaying(false);
          setError('حدث خطأ أثناء تشغيل الصوت.');
        });
      }
    };
  }, []);

  useEffect(() => {
    // جلب السورة الحالية
    const fetchCurrentSurah = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSurahByNumber(surahNumber);
        setCurrentSurah(data);
      } catch (error) {
        console.error(`خطأ في جلب السورة رقم ${surahNumber}:`, error);
        setError('حدث خطأ أثناء تحميل السورة.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentSurah();

    // إيقاف الصوت عند تغيير السورة
    if (audioElement) {
      audioElement.pause();
      setIsAudioPlaying(false);
    }
  }, [surahNumber, audioElement]);

  // تشغيل الصوت
  const playAudio = () => {
    if (
      !currentSurah ||
      !currentSurah.audio ||
      currentSurah.audio.length === 0
    ) {
      setError('لا يوجد صوت متاح لهذه السورة.');
      return;
    }

    if (!audioElement) return;

    // استخدام المقرئ الافتراضي أو الأول في القائمة
    const defaultReciterId = state.defaultReciterId || '';
    const reciter =
      currentSurah.audio.find(a => a.id.toString() === defaultReciterId) ||
      currentSurah.audio[0];
    setCurrentReciter(reciter);

    if (!audioSrc || audioSrc !== reciter.link) {
      setAudioSrc(reciter.link);
      audioElement.src = reciter.link;
    }

    if (isAudioPlaying) {
      audioElement.pause();
      setIsAudioPlaying(false);
    } else {
      audioElement.play().catch(error => {
        console.error('خطأ في تشغيل الصوت:', error);
        setError('حدث خطأ أثناء تشغيل الصوت.');
      });
      setIsAudioPlaying(true);
    }
  };

  const changeSurah = direction => {
    const currentNumber = parseInt(surahNumber, 10);
    let newNumber;

    if (direction === 'next') {
      newNumber = currentNumber < 114 ? currentNumber + 1 : 1;
    } else {
      newNumber = currentNumber > 1 ? currentNumber - 1 : 114;
    }

    navigate(`/surah/${newNumber}`);
  };

  // تنسيقات الرسوم المتحركة
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!currentSurah) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>لم يتم العثور على السورة.</span>
        </div>
      </div>
    );
  }

  // استخراج اسم السورة باللغة المطلوبة
  const surahName = currentSurah.name[state.language] || currentSurah.name.ar;

  // تحويل الآيات من سلسلة نصية JSON إلى مصفوفة إذا لزم الأمر
  const verses = Array.isArray(currentSurah.verses)
    ? currentSurah.verses
    : typeof currentSurah.verses === 'string'
    ? JSON.parse(currentSurah.verses)
    : [];

  return (
    <motion.div
      className="container mx-auto py-8 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      dir={state.language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* رأس السورة */}
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
          {surahName}
        </h1>
        <div className="flex justify-center items-center gap-2 text-sm opacity-80">
          <span>
            {currentSurah.revelation_place[state.language] ||
              currentSurah.revelation_place.ar}
          </span>
          <span>•</span>
          <span>{currentSurah.verses_count} آية</span>
          <span>•</span>
          <span>سورة رقم {currentSurah.number}</span>
        </div>
      </motion.div>

      {/* شريط الأدوات */}
      <motion.div
        variants={itemVariants}
        className="flex justify-center gap-2 mb-6"
      >
        <button
          className={`btn btn-circle ${
            isAudioPlaying ? 'btn-error' : 'btn-primary'
          }`}
          onClick={playAudio}
          aria-label={isAudioPlaying ? 'إيقاف التلاوة' : 'تشغيل التلاوة'}
        >
          {isAudioPlaying ? <Pause size={20} /> : <Volume2 size={20} />}
        </button>

        <Link
          to="/search"
          className="btn btn-circle btn-outline"
          aria-label="بحث"
        >
          <Search size={20} />
        </Link>

        <Link
          to="/settings"
          className="btn btn-circle btn-outline"
          aria-label="إعدادات"
        >
          <Settings size={20} />
        </Link>

        <Link
          to="/about"
          className="btn btn-circle btn-outline"
          aria-label="معلومات"
        >
          <Info size={20} />
        </Link>
      </motion.div>

      {/* عرض معلومات المقرئ الحالي إذا كان هناك صوت قيد التشغيل */}
      {isAudioPlaying && currentReciter && (
        <motion.div variants={itemVariants} className="alert alert-info mb-4">
          <span>جاري الاستماع إلى تلاوة: {currentReciter.reciter.ar}</span>
        </motion.div>
      )}

      {/* أزرار التنقل بين السور */}
      <motion.div variants={itemVariants} className="flex justify-between mb-6">
        <button
          className="btn btn-outline btn-sm flex items-center gap-1"
          onClick={() => changeSurah('prev')}
          disabled={loading}
        >
          {state.language === 'ar' ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
          السورة السابقة
        </button>

        <button
          className="btn btn-outline btn-sm flex items-center gap-1"
          onClick={() => changeSurah('next')}
          disabled={loading}
        >
          السورة التالية
          {state.language === 'ar' ? (
            <ChevronLeft size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>
      </motion.div>

      {/* محتوى السورة */}
      <motion.div
        variants={itemVariants}
        className="bg-base-100 rounded-xl border border-base-300 p-6 shadow-sm mb-6"
      >
        {/* البسملة */}
        {currentSurah.number !== '9' && (
          <p className="text-center mb-8 text-2xl quran-text">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
        )}

        {/* الآيات */}
        <div className="quran-text" dir="rtl">
          {verses.map(verse => (
            <motion.div
              key={verse.number}
              variants={itemVariants}
              className="relative mb-6 group"
            >
              <div className="mb-2">
                <span className="text-primary-focus">{verse.text.ar}</span>
                <span className="inline-flex justify-center items-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm mr-2">
                  {verse.number}
                </span>
              </div>

              {/* ترجمة الآية إذا كانت مفعلة */}
              {state.showTranslation && verse.text.en && (
                <p className="text-base opacity-70 mt-2 pr-4 border-r-2 border-primary/20">
                  {verse.text.en}
                </p>
              )}

              {/* أزرار التفاعل مع الآية */}
              <div className="absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="btn btn-xs btn-ghost btn-circle"
                  aria-label="تشغيل الآية"
                >
                  <Volume2 size={14} />
                </button>
                <button
                  className="btn btn-xs btn-ghost btn-circle"
                  aria-label="حفظ الآية"
                >
                  <Star size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuranViewer;
