import React, { useState, useEffect } from 'react';
import { QuranAPI } from '../utils/quranApi';
import { motion } from 'framer-motion';
import {
  Search,
  BookOpen,
  BookText,
  Filter,
  Book,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Loader2,
  FileText,
  Globe,
  Settings,
  ExternalLink,
  PanelRight,
  MenuSquare,
  AlertCircle
} from 'lucide-react';

// بيانات افتراضية للعرض في حالة فشل الاتصال
const DEFAULT_TAFSIRS = [
  { id: 1, name: 'تفسير ابن كثير' },
  { id: 2, name: 'تفسير الطبري' },
  { id: 3, name: 'تفسير القرطبي' }
];

const SearchPage = () => {
  // States for search parameters
  const [language, setLanguage] = useState('ar');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // إضافة متغيرات الحالة المفقودة
  const [apiStatus, setApiStatus] = useState('idle'); // idle, loading, success, error
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // States for tafsirs
  const [availableTafsirs, setAvailableTafsirs] = useState([]);
  const [selectedTafsir, setSelectedTafsir] = useState(null);
  const [tafsirSurahs, setTafsirSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);

  // UI states
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [resultsCount, setResultsCount] = useState(0);

  // Fetch available tafsirs when component mounts or language changes
  useEffect(() => {
    fetchAvailableTafsirs();
  }, [language]);

  // Fetch surah list when selected tafsir changes
  useEffect(() => {
    if (selectedTafsir) {
      fetchTafsirSurahs(selectedTafsir);
    }
  }, [selectedTafsir, language]);

  // Fetch available tafsirs
  const fetchAvailableTafsirs = async () => {
    try {
      setApiStatus('loading');
      setLoading(true);

      // استخدام واجهة API الجديدة لجلب التفاسير
      const data = await QuranAPI.getTafsirs(language);

      // التحقق من وجود بيانات
      if (data && data.tafasir && data.tafasir.length > 0) {
        setAvailableTafsirs(data.tafasir);
        setApiStatus('success');
        setError(null);
        setIsOfflineMode(false);
      } else {
        console.warn('No tafsirs data available, using defaults');
        setAvailableTafsirs(DEFAULT_TAFSIRS);
        setIsOfflineMode(true);
      }
    } catch (err) {
      console.error('Error fetching tafsirs:', err);
      setError('تعذر تحميل التفاسير. يتم استخدام البيانات الافتراضية.');
      setApiStatus('error');
      setAvailableTafsirs(DEFAULT_TAFSIRS);
      setIsOfflineMode(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch surahs for selected tafsir
  const fetchTafsirSurahs = async tafsirId => {
    if (isOfflineMode) {
      // في وضع عدم الاتصال، نستخدم بيانات افتراضية
      const defaultSurahs = Array(114)
        .fill()
        .map((_, idx) => ({
          id: idx + 1,
          name: `سورة ${idx + 1}`,
          tafsir_id: tafsirId
        }));
      setTafsirSurahs(defaultSurahs.slice(0, 10)); // نعرض أول 10 سور فقط كمثال
      return;
    }

    try {
      setLoading(true);

      // استخدام واجهة API الجديدة لجلب سور التفسير
      const data = await QuranAPI.getTafsirSurahs(tafsirId, language);

      // التأكد من أن البيانات تحتوي على مصفوفة
      if (data && data.tafasir && Array.isArray(data.tafasir)) {
        setTafsirSurahs(data.tafasir);
        setError(null);
      } else {
        console.warn(
          'No tafsir surahs available or invalid format, using defaults'
        );
        // استخدام بيانات افتراضية في حالة عدم وجود بيانات
        const defaultSurahs = Array(10)
          .fill()
          .map((_, idx) => ({
            id: idx + 1,
            name: `سورة ${idx + 1}`,
            tafsir_id: tafsirId
          }));
        setTafsirSurahs(defaultSurahs);
      }
    } catch (err) {
      console.error('Error fetching tafsir surahs:', err);
      setError('تعذر تحميل سور التفسير.');
      // استخدام بيانات افتراضية في حالة الخطأ
      const defaultSurahs = Array(10)
        .fill()
        .map((_, idx) => ({
          id: idx + 1,
          name: `سورة ${idx + 1}`,
          tafsir_id: tafsirId
        }));
      setTafsirSurahs(defaultSurahs);
    } finally {
      setLoading(false);
    }
  };

  // Handle search submission
  const handleSearch = async e => {
    e.preventDefault();
    setIsSearching(true);

    if (!searchQuery.trim()) {
      setError('الرجاء إدخال كلمة للبحث');
      setIsSearching(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearchResults([]);

      console.log('Searching for:', searchQuery);

      // استخدام واجهة API الجديدة للبحث
      const data = await QuranAPI.searchVerses(searchQuery, language);

      console.log('Search results:', data);

      if (!data || !data.data || !data.data.matches) {
        throw new Error('تنسيق البيانات المستلمة غير متوقع');
      }

      // معالجة نتائج البحث وإضافة التفاسير لها
      const uniqueResults = new Map();

      await Promise.all(
        data.data.matches.map(async match => {
          try {
            // إنشاء مفتاح فريد لكل نتيجة لتجنب التكرار
            const resultKey = `${match.surah.number}-${match.numberInSurah}`;

            // تخطي التكرارات
            if (uniqueResults.has(resultKey)) return;

            let tafsirText = 'تفسير غير متاح';

            // إذا تم تحديد تفسير معين
            if (selectedTafsir) {
              try {
                if (selectedSurah) {
                  // استخدام تفسير سورة محددة إذا تم اختيارها
                  const tafsirData = await QuranAPI.getTafsirSurah(
                    selectedTafsir,
                    match.surah.number,
                    language
                  );
                  tafsirText =
                    tafsirData.tafsir?.text || 'تفسير غير متاح للآية المحددة';
                } else {
                  // استخدام التفسير العام
                  const tafsirData = await QuranAPI.getTafsir(match.number);
                  tafsirText = tafsirData.data[0]?.text || 'تفسير غير متاح';
                }
              } catch (tafsirError) {
                console.warn('Error fetching selected tafsir:', tafsirError);
                // الرجوع للتفسير الافتراضي في حالة الخطأ
                const defaultTafsir = await QuranAPI.getTafsir(match.number);
                tafsirText = defaultTafsir.data[0]?.text || 'تفسير غير متاح';
              }
            } else {
              // استخدام التفسير الافتراضي
              const tafsirData = await QuranAPI.getTafsir(match.number);
              tafsirText = tafsirData.data[0]?.text || 'تفسير غير متاح';
            }

            uniqueResults.set(resultKey, {
              surah: match.surah.name,
              surahNumber: match.surah.number,
              numberInSurah: match.numberInSurah,
              text: match.text,
              tafsir: tafsirText
            });
          } catch (error) {
            console.error('Error processing search result:', error);
          }
        })
      );

      const processedResults = Array.from(uniqueResults.values());
      setSearchResults(processedResults);
      setResultsCount(processedResults.length);

      if (processedResults.length === 0) {
        setError(`لم يتم العثور على نتائج تطابق "${searchQuery}"`);
      }
    } catch (err) {
      console.error('Error in search:', err);
      setError('حدث خطأ أثناء البحث: ' + err.message);

      // في حالة الخطأ نعرض نتائج افتراضية للاختبار
      const mockResults = getDefaultSearchResults(searchQuery);
      setSearchResults(mockResults);
      setResultsCount(mockResults.length);
      setError('تم عرض نتائج افتراضية. يرجى التحقق من اتصالك بالإنترنت.');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // دالة مساعدة لإنشاء نتائج بحث افتراضية
  const getDefaultSearchResults = query => {
    // نتائج افتراضية للكلمات الشائعة
    if (query.includes('الله') || query.includes('الرحمن')) {
      return [
        {
          surah: 'الفاتحة',
          surahNumber: 1,
          numberInSurah: 1,
          text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
          tafsir:
            'بدأ الله تعالى كتابه العزيز بهذه الآية المباركة افتتاحاً وتبرّكاً، وتعليماً لعباده أن يبدأوا أمورهم باسمه تعالى.'
        },
        {
          surah: 'الإخلاص',
          surahNumber: 112,
          numberInSurah: 1,
          text: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
          tafsir:
            'سورة الإخلاص تبين صفات الله تعالى وتؤكد على وحدانيته وتنفي الشرك.'
        }
      ];
    }

    if (query.includes('محمد')) {
      return [
        {
          surah: 'آل عمران',
          surahNumber: 3,
          numberInSurah: 144,
          text: 'وَمَا مُحَمَّدٌ إِلَّا رَسُولٌ قَدْ خَلَتْ مِن قَبْلِهِ الرُّسُلُ',
          tafsir:
            'هذه الآية تؤكد أن النبي محمد صلى الله عليه وسلم هو رسول من البشر مثل الرسل الذين سبقوه.'
        }
      ];
    }

    // نتائج افتراضية عامة
    return [
      {
        surah: 'البقرة',
        surahNumber: 2,
        numberInSurah: 255,
        text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
        tafsir:
          'آية الكرسي من أعظم آيات القرآن الكريم، وفيها بيان لعظمة الله تعالى وصفاته.'
      }
    ];
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="bg-gradient-to-br from-base-200/80 to-base-100 backdrop-blur-sm shadow-xl rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 Q25,50 50,25 Q75,0 100,25 L100,100 L0,100 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M0,100 Q25,50 50,75 Q75,100 100,75 L100,0 L0,0 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Page title */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold font-arabic bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            البحث المتقدم في القرآن الكريم والتفاسير
          </h2>
          <div className="h-1 w-64 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-2"></div>
        </motion.div>

        {/* وضع التشغيل (متصل أو غير متصل) */}
        {isOfflineMode && (
          <motion.div
            variants={fadeIn}
            className="alert alert-warning shadow-lg mb-4"
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={20} />
              <span>
                تم تنشيط وضع عدم الاتصال. بعض الميزات قد لا تعمل بشكل كامل.
              </span>
            </div>
          </motion.div>
        )}

        {/* Search form */}
        <motion.div
          variants={containerVariants}
          className="flex flex-col bg-base-100/50 backdrop-blur-md rounded-xl shadow-lg p-6 border border-base-300/40 mb-6"
        >
          <motion.form
            onSubmit={handleSearch}
            variants={containerVariants}
            className="space-y-4"
          >
            {/* Main search input */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <label className="label">
                <span className="label-text text-lg font-semibold flex items-center gap-2">
                  <Search size={18} className="text-primary" />
                  أدخل كلمة أو جملة للبحث في القرآن الكريم
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="مثال: الرحمن، اهدنا الصراط المستقيم، نور..."
                  className="input input-bordered w-full bg-base-100 focus:ring-2 focus:ring-primary/50 transition-all text-lg py-6"
                />
                <motion.button
                  type="submit"
                  disabled={loading || !searchQuery.trim()}
                  className="absolute left-2 top-1/2 -translate-y-1/2 btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    'بحث'
                  )}
                  <Search size={18} />
                </motion.button>
              </div>
            </motion.div>

            {/* Toggle advanced options */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="btn btn-ghost btn-sm gap-2 text-primary"
              >
                <Settings size={16} />
                خيارات البحث المتقدمة
                {showAdvancedOptions ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </motion.div>

            {/* Advanced options */}
            <AnimatedExpandSection isVisible={showAdvancedOptions}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-200/50 p-4 rounded-lg">
                {/* Language selection */}
                <div className="flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <Globe size={16} className="text-primary" />
                      لغة البحث والنتائج
                    </span>
                  </label>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="select select-bordered w-full bg-base-100"
                  >
                    <option value="ar">العربية</option>
                    <option value="eng">الإنجليزية</option>
                  </select>
                </div>

                {/* Tafsir selection */}
                <div className="flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <BookText size={16} className="text-primary" />
                      اختر التفسير
                    </span>
                  </label>
                  <select
                    value={selectedTafsir || ''}
                    onChange={e => setSelectedTafsir(e.target.value || null)}
                    className="select select-bordered w-full bg-base-100"
                  >
                    <option value="">-- جميع التفاسير --</option>
                    {availableTafsirs.map(tafsir => (
                      <option key={tafsir.id} value={tafsir.id}>
                        {tafsir.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Surah selection (shown only if tafsir is selected) */}
                {selectedTafsir && (
                  <div className="flex flex-col md:col-span-2">
                    <label className="label">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <Book size={16} className="text-primary" />
                        اختر سورة محددة (اختياري)
                      </span>
                    </label>
                    <select
                      value={selectedSurah || ''}
                      onChange={e => setSelectedSurah(e.target.value || null)}
                      className="select select-bordered w-full bg-base-100"
                    >
                      <option value="">-- جميع السور --</option>
                      {/* التحقق من أن tafsirSurahs مصفوفة قبل استخدام map */}
                      {Array.isArray(tafsirSurahs) &&
                        tafsirSurahs.map(surah => (
                          <option key={surah.id} value={surah.id}>
                            {surah.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            </AnimatedExpandSection>
          </motion.form>
        </motion.div>

        {/* Search results */}
        <motion.div variants={staggerContainerVariants} className="space-y-2">
          {/* Results header */}
          {searchResults.length > 0 && !loading && (
            <motion.div
              variants={fadeIn}
              className="flex items-center justify-between mb-4 bg-base-300/30 rounded-lg p-3"
            >
              <div className="flex items-center gap-2">
                <PanelRight className="text-primary" size={20} />
                <span className="font-semibold">نتائج البحث</span>
                <div className="badge badge-primary">{resultsCount}</div>
              </div>
              <div className="text-sm opacity-70">
                {`البحث عن: "${searchQuery}"`}
              </div>
            </motion.div>
          )}

          {/* Loading indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="text-primary h-16 w-16" />
              </motion.div>
              <p className="mt-4 text-lg font-semibold text-primary/70">
                جاري البحث في القرآن الكريم...
              </p>
            </motion.div>
          )}

          {/* Error message */}
          {error && !loading && (
            <motion.div
              variants={fadeIn}
              className="alert alert-error shadow-lg"
            >
              <div className="flex-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 mx-2 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <label>{error}</label>
              </div>
            </motion.div>
          )}

          {/* No results message */}
          {isSearching === false &&
            searchQuery &&
            searchResults.length === 0 &&
            !loading &&
            !error && (
              <motion.div
                variants={fadeIn}
                className="flex flex-col items-center justify-center py-16"
              >
                <Search className="text-base-content/30 h-20 w-20" />
                <p className="mt-4 text-center text-lg">
                  لم يتم العثور على نتائج تطابق "{searchQuery}"
                </p>
                <p className="text-center opacity-60 mt-2">
                  حاول باستخدام كلمات أو عبارات مختلفة
                </p>
              </motion.div>
            )}

          {/* Results list */}
          {searchResults.length > 0 && !loading && (
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <motion.div
                  key={`${result.surahNumber}-${result.numberInSurah}`}
                  variants={itemVariants}
                  className="bg-base-100 border border-base-300/30 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Result header */}
                  <div className="bg-base-200/80 p-3 flex justify-between items-center border-b border-base-300/30">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="text-primary text-sm font-semibold">
                          {index + 1}
                        </span>
                      </div>
                      <h3 className="font-bold">
                        سورة {result.surah}
                        <span className="mx-2 text-primary/70">•</span>
                        الآية {result.numberInSurah}
                      </h3>
                    </div>
                    <a
                      href={`/quran/reader/${result.surahNumber}?ayah=${result.numberInSurah}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm btn-circle"
                      title="فتح في المصحف"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>

                  {/* Verse text */}
                  <div className="p-4 bg-base-100">
                    <p className="text-xl leading-relaxed font-quran text-right arabic-text">
                      {result.text}
                    </p>
                  </div>

                  {/* Tafsir collapsible section */}
                  <details className="border-t border-base-200">
                    <summary className="p-3 cursor-pointer hover:bg-base-200/50 transition-colors flex items-center gap-2">
                      <FileText size={18} className="text-primary" />
                      <span className="font-semibold">التفسير</span>
                    </summary>
                    <div className="p-4 bg-base-200/30 border-t border-base-200 text-right">
                      <p className="leading-relaxed text-sm">{result.tafsir}</p>
                    </div>
                  </details>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Helper component for animated expanding sections
const AnimatedExpandSection = ({ isVisible, children }) => {
  return (
    <motion.div
      initial={false}
      animate={{
        height: isVisible ? 'auto' : 0,
        opacity: isVisible ? 1 : 0
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut'
      }}
      style={{ overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  );
};

export default SearchPage;
