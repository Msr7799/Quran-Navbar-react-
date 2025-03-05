import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme, AVAILABLE_THEMES, AVAILABLE_FONTS } from '../ThemeContext';
import {
  Globe,
  Type,
  Book,
  Headphones,
  PaintBucket,
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Check,
  Sun,
  Moon,
  Monitor,
  BookOpen,
  Volume2,
  Palette
} from 'lucide-react';

// قائمة اللغات المدعومة
const AVAILABLE_LANGUAGES = [
  { code: 'ar', name: 'العربية', native: 'العربية' },
  { code: 'eng', name: 'English', native: 'English' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'fa', name: 'Persian', native: 'فارسی' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' }
];

// المجموعات المواضيعية للثيمات لتنظيمها
const THEME_GROUPS = [
  {
    name: 'أساسية',
    themes: ['light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate']
  },
  {
    name: 'ملونة',
    themes: [
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden'
    ]
  },
  {
    name: 'طبيعة',
    themes: ['forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe']
  },
  {
    name: 'داكنة',
    themes: ['black', 'luxury', 'dracula', 'cmyk', 'night', 'business']
  },
  {
    name: 'أخرى',
    themes: ['autumn', 'acid', 'lemonade', 'coffee', 'winter']
  }
];

// دالة للحصول على معلومات اللغة المختارة
const getLanguageInfo = code => {
  return (
    AVAILABLE_LANGUAGES.find(lang => lang.code === code) ||
    AVAILABLE_LANGUAGES[0]
  );
};

const Settings = () => {
  const { state, dispatch } = useTheme();
  const [activeSection, setActiveSection] = useState('language');
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // استخراج إعدادات الحالة الحالية
  const [theme, setTheme] = useState(state.theme || 'light');
  const [appLanguage, setAppLanguage] = useState(state.language || 'ar');
  const [quranLanguage, setQuranLanguage] = useState(
    state.quranLanguage || 'ar'
  );
  const [fontFamily, setFontFamily] = useState(
    state.fontFamily || AVAILABLE_FONTS[0].value
  );
  const [fontSize, setFontSize] = useState(state.fontSize || 20);
  const [lineSpacing, setLineSpacing] = useState(state.lineSpacing || 1.8);
  const [showTranslation, setShowTranslation] = useState(
    state.showTranslation !== false
  );
  const [showWordByWord, setShowWordByWord] = useState(
    state.showWordByWord !== false
  );
  const [defaultReciterId, setDefaultReciterId] = useState(
    state.defaultReciterId || ''
  );
  const [defaultRewayaId, setDefaultRewayaId] = useState(
    state.defaultRewayaId || ''
  );
  const [defaultTafsirId, setDefaultTafsirId] = useState(
    state.defaultTafsirId || ''
  );

  // متغير للتبديل بين عرض الثيمات كقائمة أو شبكة
  const [showThemesAsList, setShowThemesAsList] = useState(false);

  // بيانات API
  const [availableReciters, setAvailableReciters] = useState([]);
  const [availableRewayat, setAvailableRewayat] = useState([]);
  const [availableTafasir, setAvailableTafasir] = useState([]);

  // معاينة الثيم قبل تطبيقه
  const [previewTheme, setPreviewTheme] = useState(null);

  useEffect(() => {
    // عند التأشير على ثيم، نقوم بعرضه مؤقتاً
    if (previewTheme) {
      document.documentElement.setAttribute('data-theme', previewTheme);
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [previewTheme, theme]);

  // جلب البيانات من API عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // جلب قائمة القراء
        const recitersResponse = await fetch(
          `https://mp3quran.net/api/v3/reciters?language=${appLanguage}`
        );
        if (recitersResponse.ok) {
          const recitersData = await recitersResponse.json();
          if (recitersData && recitersData.reciters) {
            setAvailableReciters(recitersData.reciters);
          }
        }

        // جلب قائمة الروايات
        const riwayatResponse = await fetch(
          `https://mp3quran.net/api/v3/riwayat?language=${appLanguage}`
        );
        if (riwayatResponse.ok) {
          const riwayatData = await riwayatResponse.json();
          if (riwayatData && riwayatData.riwayat) {
            setAvailableRewayat(riwayatData.riwayat);
          }
        }

        // جلب قائمة التفاسير
        const tafasirResponse = await fetch(
          `https://mp3quran.net/api/v3/tafasir?language=${appLanguage}`
        );
        if (tafasirResponse.ok) {
          const tafasirData = await tafasirResponse.json();
          if (tafasirData && tafasirData.tafasir) {
            setAvailableTafasir(tafasirData.tafasir);
          }
        }
      } catch (error) {
        console.error('حدث خطأ أثناء جلب البيانات:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appLanguage]);

  // حفظ الإعدادات وتطبيقها
  const saveSettings = () => {
    const updatedSettings = {
      theme,
      language: appLanguage,
      quranLanguage,
      fontFamily,
      fontSize,
      lineSpacing,
      showTranslation,
      showWordByWord,
      defaultReciterId,
      defaultRewayaId,
      defaultTafsirId
    };

    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: updatedSettings
    });

    // إظهار رسالة تأكيد الحفظ
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // استعادة الإعدادات الافتراضية
  const resetSettings = () => {
    setTheme('light');
    setAppLanguage('ar');
    setQuranLanguage('ar');
    setFontFamily(AVAILABLE_FONTS[0].value);
    setFontSize(20);
    setLineSpacing(1.8);
    setShowTranslation(true);
    setShowWordByWord(true);
    setDefaultReciterId('');
    setDefaultRewayaId('');
    setDefaultTafsirId('');
  };

  // تنسيقات الرسوم المتحركة
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // عرض مقطع الإعدادات
  const renderSettingSection = section => {
    switch (section) {
      case 'language':
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">
              إعدادات اللغة والترجمة
            </h3>

            <div className="form-control">
              <label className="label">
                <span className="label-text">لغة واجهة التطبيق</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={appLanguage}
                onChange={e => setAppLanguage(e.target.value)}
              >
                {AVAILABLE_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">لغة محتوى القرآن والترجمات</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={quranLanguage}
                onChange={e => setQuranLanguage(e.target.value)}
              >
                {AVAILABLE_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
              <div className="text-xs opacity-70 mt-1 pr-1">
                يؤثر هذا الإعداد على لغة الترجمات والتفاسير وبيانات السور
              </div>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={showTranslation}
                  onChange={() => setShowTranslation(!showTranslation)}
                />
                <span className="label-text">عرض الترجمة</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={showWordByWord}
                  onChange={() => setShowWordByWord(!showWordByWord)}
                />
                <span className="label-text">عرض معاني الكلمات</span>
              </label>
            </div>
          </motion.div>
        );

      case 'font':
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">إعدادات الخط والعرض</h3>

            <div className="form-control">
              <label className="label">
                <span className="label-text">نوع الخط</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={fontFamily}
                onChange={e => setFontFamily(e.target.value)}
              >
                {AVAILABLE_FONTS.map(font => (
                  <option
                    key={font.name}
                    value={font.value}
                    style={{ fontFamily: font.value }}
                  >
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">حجم الخط: {fontSize}px</span>
              </label>
              <input
                type="range"
                min="14"
                max="36"
                value={fontSize}
                onChange={e => setFontSize(parseInt(e.target.value))}
                className="range range-primary"
                step="1"
              />
              <div className="w-full flex justify-between text-xs px-2 mt-1">
                <span>صغير</span>
                <span>متوسط</span>
                <span>كبير</span>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  المسافة بين الأسطر: {lineSpacing}
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="3"
                value={lineSpacing}
                onChange={e => setLineSpacing(parseFloat(e.target.value))}
                className="range range-primary"
                step="0.1"
              />
              <div className="w-full flex justify-between text-xs px-2 mt-1">
                <span>ضيق</span>
                <span>متوسط</span>
                <span>واسع</span>
              </div>
            </div>

            <div className="bg-base-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold mb-2">معاينة الخط</h4>
              <p
                className="text-right text-primary"
                style={{
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}px`,
                  lineHeight: lineSpacing
                }}
              >
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
              <p
                className="text-right"
                style={{
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}px`,
                  lineHeight: lineSpacing
                }}
              >
                الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
              </p>
            </div>
          </motion.div>
        );

      case 'appearance':
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">إعدادات المظهر</h3>

            <div className="flex items-center justify-between mb-4">
              <span className="label-text font-medium">سمات DaisyUI</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowThemesAsList(false)}
                  className={`btn btn-sm ${
                    !showThemesAsList ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowThemesAsList(true)}
                  className={`btn btn-sm ${
                    showThemesAsList ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="8" x2="21" y1="6" y2="6" />
                    <line x1="8" x2="21" y1="12" y2="12" />
                    <line x1="8" x2="21" y1="18" y2="18" />
                    <line x1="3" x2="3" y1="6" y2="6" />
                    <line x1="3" x2="3" y1="12" y2="12" />
                    <line x1="3" x2="3" y1="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {showThemesAsList ? (
              // عرض الثيمات كقائمة
              <div className="space-y-4">
                {THEME_GROUPS.map(group => (
                  <div key={group.name} className="mb-4">
                    <h4 className="font-medium mb-2 text-primary">
                      {group.name}
                    </h4>
                    <div className="space-y-2">
                      {group.themes.map(themeName => (
                        <div
                          key={themeName}
                          className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg hover:bg-base-300 ${
                            theme === themeName
                              ? 'bg-base-300 outline outline-1 outline-primary'
                              : ''
                          }`}
                          onClick={() => setTheme(themeName)}
                          onMouseEnter={() => setPreviewTheme(themeName)}
                          onMouseLeave={() => setPreviewTheme(null)}
                        >
                          <div
                            className="w-8 h-8 rounded-md border border-base-300"
                            data-theme={themeName}
                          >
                            <div className="bg-base-100 h-1/2 rounded-t-sm"></div>
                            <div className="bg-primary h-1/2 rounded-b-sm"></div>
                          </div>
                          <span>{themeName}</span>
                          {theme === themeName && (
                            <span className="ml-auto badge badge-primary">
                              مُفعّل
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // عرض الثيمات كشبكة
              <div className="space-y-6">
                {THEME_GROUPS.map(group => (
                  <div key={group.name} className="mb-4">
                    <h4 className="font-medium mb-2 text-primary">
                      {group.name}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {group.themes.map(themeName => (
                        <div
                          key={themeName}
                          className={`p-3 cursor-pointer rounded-lg hover:bg-base-300 ${
                            theme === themeName
                              ? 'bg-base-300 outline outline-1 outline-primary'
                              : ''
                          }`}
                          onClick={() => setTheme(themeName)}
                          onMouseEnter={() => setPreviewTheme(themeName)}
                          onMouseLeave={() => setPreviewTheme(null)}
                        >
                          <div
                            className="h-12 rounded-md mb-2 border border-base-300 overflow-hidden"
                            data-theme={themeName}
                          >
                            <div className="flex h-full">
                              <div className="bg-base-100 w-1/4 h-full"></div>
                              <div className="bg-base-200 w-1/4 h-full"></div>
                              <div className="bg-primary w-1/4 h-full"></div>
                              <div className="bg-secondary w-1/4 h-full"></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{themeName}</span>
                            {theme === themeName && (
                              <span className="badge badge-primary badge-xs">
                                ✓
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* معاينة الثيم الحالي */}
            <div className="mt-8 p-4 rounded-lg border border-base-300">
              <h4 className="font-medium mb-3">
                معاينة الثيم: {previewTheme || theme}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="bg-base-100 p-2 rounded-md text-xs">
                  base-100
                </div>
                <div className="bg-base-200 p-2 rounded-md text-xs">
                  base-200
                </div>
                <div className="bg-base-300 p-2 rounded-md text-xs">
                  base-300
                </div>
                <div className="bg-base-content p-2 rounded-md text-xs text-base-100">
                  base-content
                </div>
                <div className="bg-primary p-2 rounded-md text-xs text-primary-content">
                  primary
                </div>
                <div className="bg-secondary p-2 rounded-md text-xs text-secondary-content">
                  secondary
                </div>
                <div className="bg-accent p-2 rounded-md text-xs text-accent-content">
                  accent
                </div>
                <div className="bg-neutral p-2 rounded-md text-xs text-neutral-content">
                  neutral
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'recitation':
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">
              إعدادات التلاوة والقراءات
            </h3>

            {loading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">القارئ الافتراضي</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={defaultReciterId}
                    onChange={e => setDefaultReciterId(e.target.value)}
                  >
                    <option value="">-- اختر القارئ --</option>
                    {availableReciters.map(reciter => (
                      <option key={reciter.id} value={reciter.id}>
                        {reciter.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">الرواية المفضلة</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={defaultRewayaId}
                    onChange={e => setDefaultRewayaId(e.target.value)}
                    disabled={availableRewayat.length === 0}
                  >
                    <option value="">-- اختر الرواية --</option>
                    {availableRewayat.map(rewaya => (
                      <option key={rewaya.id} value={rewaya.id}>
                        {rewaya.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </motion.div>
        );

      case 'content':
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">إعدادات المحتوى</h3>

            {loading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">التفسير الافتراضي</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={defaultTafsirId}
                    onChange={e => setDefaultTafsirId(e.target.value)}
                    disabled={availableTafasir.length === 0}
                  >
                    <option value="">-- اختر التفسير --</option>
                    {availableTafasir.map(tafsir => (
                      <option key={tafsir.id} value={tafsir.id}>
                        {tafsir.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="alert alert-info mt-4">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-current shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>
                      يمكنك الوصول إلى المزيد من التفاسير والمحتوى من خلال صفحة
                      البحث.
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto py-8 px-4 max-w-4xl"
    >
      <motion.h1
        variants={itemVariants}
        className="text-3xl font-bold mb-6 flex items-center gap-2"
      >
        <SettingsIcon className="text-primary" />
        الإعدادات
      </motion.h1>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-5 gap-6"
      >
        {/* قائمة التبويبات */}
        <div className="md:col-span-1 space-y-1">
          <button
            onClick={() => setActiveSection('language')}
            className={`btn btn-block justify-start gap-2 ${
              activeSection === 'language' ? 'btn-primary' : 'btn-ghost'
            }`}
          >
            <Globe size={18} />
            اللغة والترجمة
          </button>

          <button
            onClick={() => setActiveSection('font')}
            className={`btn btn-block justify-start gap-2 ${
              activeSection === 'font' ? 'btn-primary' : 'btn-ghost'
            }`}
          >
            <Type size={18} />
            الخط والعرض
          </button>

          <button
            onClick={() => setActiveSection('appearance')}
            className={`btn btn-block justify-start gap-2 ${
              activeSection === 'appearance' ? 'btn-primary' : 'btn-ghost'
            }`}
          >
            <PaintBucket size={18} />
            المظهر
          </button>

          <button
            onClick={() => setActiveSection('recitation')}
            className={`btn btn-block justify-start gap-2 ${
              activeSection === 'recitation' ? 'btn-primary' : 'btn-ghost'
            }`}
          >
            <Headphones size={18} />
            التلاوة
          </button>

          <button
            onClick={() => setActiveSection('content')}
            className={`btn btn-block justify-start gap-2 ${
              activeSection === 'content' ? 'btn-primary' : 'btn-ghost'
            }`}
          >
            <Book size={18} />
            المحتوى
          </button>

          {/* أزرار الإجراءات */}
          <div className="pt-6 pb-2 border-t border-base-300 space-y-2 mt-6">
            <button
              onClick={saveSettings}
              className="btn btn-success btn-block gap-2"
              disabled={isSaved}
            >
              {isSaved ? <Check size={18} /> : <Save size={18} />}
              {isSaved ? 'تم الحفظ' : 'حفظ الإعدادات'}
            </button>

            <button
              onClick={resetSettings}
              className="btn btn-outline btn-block gap-2"
            >
              <RotateCcw size={18} />
              استعادة الافتراضي
            </button>
          </div>
        </div>

        {/* محتوى الإعدادات */}
        <div className="md:col-span-4 bg-base-100 p-6 rounded-xl border border-base-300">
          {renderSettingSection(activeSection)}
        </div>
      </motion.div>

      {/* قسم المعلومات */}
      <motion.div variants={itemVariants} className="mt-10">
        <motion.div className="collapse collapse-arrow bg-base-200">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium flex items-center gap-2">
            <Globe size={18} className="text-primary" />
            معلومات اللغات المتاحة
          </div>
          <div className="collapse-content">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>الرمز</th>
                    <th>اللغة</th>
                    <th>الاسم المحلي</th>
                    <th>الروابط</th>
                  </tr>
                </thead>
                <tbody>
                  {AVAILABLE_LANGUAGES.map(lang => (
                    <tr key={lang.code}>
                      <td>{lang.code}</td>
                      <td>{lang.name}</td>
                      <td
                        dir={
                          lang.code === 'ar' ||
                          lang.code === 'ur' ||
                          lang.code === 'fa'
                            ? 'rtl'
                            : 'ltr'
                        }
                      >
                        {lang.native}
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <a
                            href={`https://mp3quran.net/api/v3/reciters?language=${lang.code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-xs btn-ghost"
                          >
                            <Headphones size={12} />
                          </a>
                          <a
                            href={`https://mp3quran.net/api/v3/tafasir?language=${lang.code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-xs btn-ghost"
                          >
                            <BookOpen size={12} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
