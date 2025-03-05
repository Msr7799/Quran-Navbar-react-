import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  BookmarkPlus,
  Share2,
  Maximize,
  Minimize,
  X
} from 'lucide-react';
import { useTheme } from '../ThemeContext';

const QuranReader = () => {
  const { surahId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state: themeState } = useTheme();

  const [surahData, setSurahData] = useState(null);
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [highlightedVerse, setHighlightedVerse] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [textSize, setTextSize] = useState(themeState.fontSize || 'medium');
  const [showTafsir, setShowTafsir] = useState(false);
  const [tafsirContent, setTafsirContent] = useState('');
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioVerse, setCurrentAudioVerse] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [availableReciters, setAvailableReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState('mishari_alafasy');

  const audioRef = useRef(null);
  const contentRef = useRef(null);
  const verseRefs = useRef({});

  // استخراج رقم الآية من URL إذا وجد
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const verseParam = searchParams.get('verse');

    if (verseParam && !isNaN(parseInt(verseParam))) {
      const verseNumber = parseInt(verseParam);
      setHighlightedVerse(verseNumber);

      // التمرير إلى الآية بعد تحميل البيانات
      setTimeout(() => {
        if (verseRefs.current[verseNumber]) {
          verseRefs.current[verseNumber].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 500);
    }
  }, [location.search, surahData]);

  // جلب بيانات السور
  useEffect(() => {
    fetch('/data/surahs.json')
      .then(response => response.json())
      .then(data => {
        setSurahs(data);
      })
      .catch(err => {
        console.error('Error loading surahs data:', err);
        setError('فشل في تحميل بيانات السور');
      });

    // جلب قائمة القراء المتاحين
    setAvailableReciters([
      { id: 'mishari_alafasy', name: 'مشاري العفاسي' },
      { id: 'abdulbasit', name: 'عبد الباسط عبد الصمد' },
      { id: 'maher_almuaiqly', name: 'ماهر المعيقلي' }
    ]);
  }, []);

  // جلب بيانات السورة عند تغيير الـ surahId
  useEffect(() => {
    if (surahId) {
      setLoading(true);

      fetch(`/data/quran/${surahId}.json`)
        .then(response => {
          if (!response.ok) throw new Error('فشل في تحميل بيانات السورة');
          return response.json();
        })
        .then(data => {
          setSurahData(data);
          setLoading(false);

          // إذا كانت هناك آية محددة، قم بالتمرير إليها
          if (highlightedVerse && verseRefs.current[highlightedVerse]) {
            verseRefs.current[highlightedVerse].scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        })
        .catch(err => {
          console.error('Error loading surah data:', err);
          setError('فشل في تحميل بيانات السورة');
          setLoading(false);
        });
    }
  }, [surahId]);

  // وضع الشاشة الكاملة
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (contentRef.current.requestFullscreen) {
        contentRef.current.requestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  // التعامل مع الأحداث
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  // إدارة تشغيل الصوت
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentAudioVerse, selectedReciter]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playNextVerse = () => {
    if (surahData && currentAudioVerse < surahData.verses_count) {
      setCurrentAudioVerse(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  const playPreviousVerse = () => {
    if (currentAudioVerse > 1) {
      setCurrentAudioVerse(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = e => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  // تحميل التفسير للآية المحددة
  const loadTafsir = verseNumber => {
    if (selectedVerse === verseNumber && showTafsir) {
      // إغلاق التفسير إذا كان مفتوحاً بالفعل
      setShowTafsir(false);
      return;
    }

    setSelectedVerse(verseNumber);
    setTafsirLoading(true);
    setShowTafsir(true);

    // محاكاة تحميل التفسير (يمكن استبدالها بطلب API حقيقي)
    setTimeout(() => {
      setTafsirContent(
        `هذا هو تفسير الآية ${verseNumber} من سورة ${
          surahData?.name || surahId
        }. في التطبيق الحقيقي، سيتم استدعاء API لجلب التفسير الفعلي من مصادر موثوقة مثل تفسير ابن كثير، الطبري، السعدي وغيرها.`
      );
      setTafsirLoading(false);
    }, 700);
  };

  // الانتقال للسورة السابقة
  const goToPreviousSurah = () => {
    const currentIndex = parseInt(surahId);
    if (currentIndex > 1) {
      navigate(`/reader/${currentIndex - 1}`);
    }
  };

  // الانتقال للسورة التالية
  const goToNextSurah = () => {
    const currentIndex = parseInt(surahId);
    if (currentIndex < 114) {
      navigate(`/reader/${currentIndex + 1}`);
    }
  };

  // تنسيق حجم الخط بناءً على الإعدادات
  const getFontSizeClass = () => {
    switch (textSize) {
      case 'small':
        return 'text-lg';
      case 'medium':
        return 'text-xl';
      case 'large':
        return 'text-2xl';
      case 'xlarge':
        return 'text-3xl';
      default:
        return 'text-xl';
    }
  };

  // مشاركة الآية
  const shareVerse = (verseNumber, verseText) => {
    const shareText = `${verseText} [سورة ${
      surahData?.name || surahId
    } - الآية ${verseNumber}]`;
    const shareUrl = `${window.location.origin}/reader/${surahId}?verse=${verseNumber}`;

    if (navigator.share) {
      navigator
        .share({
          title: `آية من سورة ${surahData?.name || surahId}`,
          text: shareText,
          url: shareUrl
        })
        .catch(err => {
          console.log('Error sharing:', err);
        });
    } else {
      // نسخ النص إلى الحافظة
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
        alert('تم نسخ الآية إلى الحافظة');
      });
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-6" ref={contentRef}>
        {/* شريط معلومات السورة */}
        <div className="bg-base-200 rounded-lg p-4 mb-6 flex flex-wrap items-center justify-between shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full ml-3">
              <span className="font-bold text-primary">{surahId}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {loading
                  ? 'جاري التحميل...'
                  : surahData?.name || `سورة ${surahId}`}
              </h1>
              <p className="text-base-content/60 text-sm">
                {!loading &&
                surahs.find(s => s.number === parseInt(surahId))
                  ?.revelationType === 'Meccan'
                  ? 'مكية'
                  : 'مدنية'}{' '}
                • {surahData?.verses_count || '-'} آيات
              </p>
            </div>
          </div>

          <div className="flex mt-4 sm:mt-0">
            <button
              className="btn btn-sm btn-ghost ml-2"
              onClick={() => setShowSettings(!showSettings)}
              aria-label="إعدادات العرض"
            >
              <Settings size={20} />
            </button>
            <button
              className="btn btn-sm btn-ghost ml-2"
              onClick={toggleFullScreen}
              aria-label={
                isFullScreen ? 'إنهاء وضع ملء الشاشة' : 'عرض بملء الشاشة'
              }
            >
              {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>

        {/* إعدادات العرض */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-base-200 rounded-lg p-4 mb-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">إعدادات العرض</h3>
                <button
                  className="btn btn-sm btn-circle btn-ghost"
                  onClick={() => setShowSettings(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">حجم الخط</label>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <button
                      className={`btn btn-sm ${
                        textSize === 'small' ? 'btn-primary' : 'btn-outline'
                      }`}
                      onClick={() => setTextSize('small')}
                    >
                      صغير
                    </button>
                    <button
                      className={`btn btn-sm ${
                        textSize === 'medium' ? 'btn-primary' : 'btn-outline'
                      }`}
                      onClick={() => setTextSize('medium')}
                    >
                      متوسط
                    </button>
                    <button
                      className={`btn btn-sm ${
                        textSize === 'large' ? 'btn-primary' : 'btn-outline'
                      }`}
                      onClick={() => setTextSize('large')}
                    >
                      كبير
                    </button>
                    <button
                      className={`btn btn-sm ${
                        textSize === 'xlarge' ? 'btn-primary' : 'btn-outline'
                      }`}
                      onClick={() => setTextSize('xlarge')}
                    >
                      كبير جداً
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">القارئ</label>
                  <select
                    className="select select-bordered w-full"
                    value={selectedReciter}
                    onChange={e => setSelectedReciter(e.target.value)}
                  >
                    {availableReciters.map(reciter => (
                      <option key={reciter.id} value={reciter.id}>
                        {reciter.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* محتوى السورة */}
        <div className="mb-20">
          {loading ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-error/10 text-error p-4 rounded-lg">
              <h3 className="font-bold">حدث خطأ</h3>
              <p>{error}</p>
              <button
                className="btn btn-sm btn-outline mt-2"
                onClick={() => window.location.reload()}
              >
                إعادة المحاولة
              </button>
            </div>
          ) : (
            <>
              {/* البسملة */}
              {parseInt(surahId) !== 9 && (
                <div className="text-center my-6">
                  <p className={`${getFontSizeClass()} font-quran`}>
                    بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ
                  </p>
                </div>
              )}

              {/* الآيات */}
              <div className="space-y-4">
                {surahData?.verses?.map((verse, index) => {
                  // الرقم الفعلي للآية (تبدأ من 1)
                  const verseNumber = index + 1;

                  return (
                    <motion.div
                      key={verseNumber}
                      ref={el => (verseRefs.current[verseNumber] = el)}
                      className={`p-3 rounded-lg relative transition-colors ${
                        highlightedVerse === verseNumber
                          ? 'bg-primary/10'
                          : verseNumber % 2 === 0
                          ? 'bg-base-200/50'
                          : ''
                      }`}
                      whileHover={{
                        backgroundColor: 'rgba(var(--primary), 0.05)'
                      }}
                    >
                      <div className="flex flex-wrap items-start justify-between mb-2">
                        {/* رقم الآية */}
                        <span className="bg-base-200 rounded-full w-8 h-8 flex items-center justify-center text-sm ml-2">
                          {verseNumber}
                        </span>

                        {/* أدوات التفاعل مع الآية */}
                        <div className="flex space-x-1 rtl:space-x-reverse">
                          <button
                            onClick={() => loadTafsir(verseNumber)}
                            className="p-1 hover:bg-base-200 rounded"
                            aria-label="عرض التفسير"
                          >
                            <BookOpen size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setCurrentAudioVerse(verseNumber);
                              setIsPlaying(true);
                            }}
                            className="p-1 hover:bg-base-200 rounded"
                            aria-label="استماع للآية"
                          >
                            <Play size={16} />
                          </button>
                          <button
                            onClick={() => shareVerse(verseNumber, verse.text)}
                            className="p-1 hover:bg-base-200 rounded"
                            aria-label="مشاركة الآية"
                          >
                            <Share2 size={16} />
                          </button>
                          <button
                            className="p-1 hover:bg-base-200 rounded"
                            aria-label="إضافة للمفضلة"
                          >
                            <BookmarkPlus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* نص الآية */}
                      <p
                        className={`${getFontSizeClass()} font-quran text-right leading-loose`}
                        dir="rtl"
                      >
                        {verse.text}
                      </p>

                      {/* التفسير */}
                      <AnimatePresence>
                        {showTafsir && selectedVerse === verseNumber && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 p-4 bg-base-200 rounded-lg overflow-hidden"
                          >
                            <h3 className="font-bold mb-2">
                              تفسير الآية {verseNumber}
                            </h3>
                            {tafsirLoading ? (
                              <div className="loading loading-spinner loading-sm"></div>
                            ) : (
                              <p className="text-sm">{tafsirContent}</p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* شريط التنقل بين السور */}
      <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 p-2 shadow-lg z-20">
        <div className="container mx-auto flex justify-between items-center">
          <button
            className="btn btn-sm"
            onClick={goToPreviousSurah}
            disabled={parseInt(surahId) <= 1}
          >
            <ChevronRight size={20} className="ml-1" />
            السورة السابقة
          </button>

          {/* مشغل الصوت */}
          {!loading && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                className="btn btn-sm btn-circle"
                onClick={playPreviousVerse}
                disabled={currentAudioVerse <= 1}
                aria-label="الآية السابقة"
              >
                <SkipBack size={16} />
              </button>

              <button
                className="btn btn-sm btn-circle btn-primary"
                onClick={handlePlayPause}
                aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>

              <button
                className="btn btn-sm btn-circle"
                onClick={playNextVerse}
                disabled={
                  !surahData || currentAudioVerse >= surahData.verses_count
                }
                aria-label="الآية التالية"
              >
                <SkipForward size={16} />
              </button>

              <div className="hidden md:flex items-center">
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="range range-xs range-primary w-20"
                />
              </div>

              <span className="text-sm">
                {currentAudioVerse}/{surahData?.verses_count || '-'}
              </span>
            </div>
          )}

          <button
            className="btn btn-sm"
            onClick={goToNextSurah}
            disabled={parseInt(surahId) >= 114}
          >
            السورة التالية
            <ChevronLeft size={20} className="mr-1" />
          </button>
        </div>
      </div>

      {/* المقطع الصوتي */}
      <audio
        ref={audioRef}
        src={`/audio/${selectedReciter}/${surahId.padStart(
          3,
          '0'
        )}${currentAudioVerse.toString().padStart(3, '0')}.mp3`}
        onEnded={playNextVerse}
        onError={e => {
          console.error('Audio error:', e);
          setIsPlaying(false);
        }}
      />
    </div>
  );
};

export default QuranReader;
