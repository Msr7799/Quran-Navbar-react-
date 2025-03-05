import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Moon,
  Sun,
  Type,
  BookOpen,
  Globe,
  Volume,
  Trash2,
  Save,
  RotateCcw,
  Check
} from 'lucide-react';
import { useTheme } from '../ThemeContext';

const SettingsPage = () => {
  const { state, dispatch } = useTheme();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // قائمة الأصوات المتاحة
  const availableReciters = [
    { id: 'mishari_alafasy', name: 'مشاري العفاسي' },
    { id: 'abdulbasit', name: 'عبد الباسط عبد الصمد' },
    { id: 'maher_almuaiqly', name: 'ماهر المعيقلي' },
    { id: 'mahmoud_khalil_alhusary', name: 'محمود خليل الحصري' },
    { id: 'muhammad_siddiq_alminshawi', name: 'محمد صديق المنشاوي' },
    { id: 'muhammad_ayyub', name: 'محمد أيوب' }
  ];

  // قائمة الخطوط العربية المتاحة
  const availableFonts = [
    { id: 'traditional', name: 'خط المصحف التقليدي' },
    { id: 'uthmani', name: 'خط عثماني' },
    { id: 'naskh', name: 'نسخ' },
    { id: 'modern', name: 'خط حديث' }
  ];

  // تبديل وضع السمة
  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    dispatch({ type: 'SET_THEME', payload: newTheme });
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // تغيير حجم الخط
  const changeFontSize = size => {
    dispatch({ type: 'SET_FONT_SIZE', payload: size });
  };

  // تغيير الخط العربي
  const changeArabicFont = font => {
    dispatch({ type: 'SET_ARABIC_FONT', payload: font });
  };

  // تبديل عرض الترجمة
  const toggleTranslation = () => {
    dispatch({ type: 'TOGGLE_TRANSLATION' });
  };

  // تغيير صوت القارئ
  const changeReciter = reciterId => {
    dispatch({ type: 'SET_RECITER_VOICE', payload: reciterId });
  };

  // إعادة ضبط الإعدادات
  const resetSettings = () => {
    // إعادة تعيين الإعدادات الافتراضية
    dispatch({ type: 'SET_THEME', payload: 'light' });
    dispatch({ type: 'SET_FONT_SIZE', payload: 'medium' });
    dispatch({ type: 'SET_ARABIC_FONT', payload: 'traditional' });

    // في حال كانت الترجمة غير مفعلة، قم بتفعيلها
    if (!state.translationEnabled) {
      dispatch({ type: 'TOGGLE_TRANSLATION' });
    }

    dispatch({ type: 'SET_RECITER_VOICE', payload: 'mishari_alafasy' });

    // تعيين السمة على المستند
    document.documentElement.setAttribute('data-theme', 'light');

    // إخفاء نافذة التأكيد
    setShowResetConfirm(false);

    // عرض رسالة نجاح
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // حفظ الإعدادات (مستخدم بالفعل مع كل تغيير، لكن يمكن استخدامه للتأكيد)
  const saveSettings = () => {
    // عرض رسالة نجاح للمستخدم
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // تكوين الحركة
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

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">الإعدادات</h1>
        <p className="text-base-content/70">
          قم بتخصيص تجربة القرآن الكريم وفقاً لتفضيلاتك
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-8"
      >
        {/* المظهر والعرض */}
        <motion.div
          variants={itemVariants}
          className="bg-base-200 p-6 rounded-lg"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Sun className="ml-2" />
            المظهر
          </h2>

          <div className="form-control">
            <div className="flex items-center justify-between py-3 border-b border-base-300">
              <div>
                <h3 className="font-medium">وضع العرض</h3>
                <p className="text-sm text-base-content/70">
                  الوضع الفاتح أو المظلم
                </p>
              </div>
              <label className="swap swap-rotate">
                <input
                  type="checkbox"
                  checked={state.theme === 'dark'}
                  onChange={toggleTheme}
                />
                <Sun className="swap-off" />
                <Moon className="swap-on" />
              </label>
            </div>

            <div className="py-4 border-b border-base-300">
              <div className="mb-2">
                <h3 className="font-medium">حجم الخط</h3>
                <p className="text-sm text-base-content/70">
                  تعديل حجم خط العرض للقرآن
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {['small', 'medium', 'large', 'xlarge'].map(size => (
                  <button
                    key={size}
                    className={`btn btn-sm ${
                      state.fontSize === size ? 'btn-primary' : 'btn-outline'
                    }`}
                    onClick={() => changeFontSize(size)}
                  >
                    {size === 'small'
                      ? 'صغير'
                      : size === 'medium'
                      ? 'متوسط'
                      : size === 'large'
                      ? 'كبير'
                      : 'كبير جداً'}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-4">
              <div className="mb-2">
                <h3 className="font-medium">نوع الخط العربي</h3>
                <p className="text-sm text-base-content/70">
                  اختيار نوع الخط المستخدم لعرض القرآن
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {availableFonts.map(font => (
                  <button
                    key={font.id}
                    className={`btn btn-sm ${
                      state.arabicFont === font.id
                        ? 'btn-primary'
                        : 'btn-outline'
                    }`}
                    onClick={() => changeArabicFont(font.id)}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* الترجمة والتفسير */}
        <motion.div
          variants={itemVariants}
          className="bg-base-200 p-6 rounded-lg"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <BookOpen className="ml-2" />
            الترجمة والتفسير
          </h2>

          <div className="form-control">
            <label className="cursor-pointer flex items-center justify-between py-3 border-b border-base-300">
              <div>
                <h3 className="font-medium">عرض الترجمة</h3>
                <p className="text-sm text-base-content/70">
                  إظهار الترجمة مع النص القرآني
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={state.translationEnabled}
                onChange={toggleTranslation}
              />
            </label>

            <div className="py-4">
              <div className="mb-2">
                <h3 className="font-medium">لغة الترجمة</h3>
                <p className="text-sm text-base-content/70">
                  اختيار لغة الترجمة المفضلة
                </p>
              </div>
              <select
                className="select select-bordered w-full max-w-xs"
                disabled={!state.translationEnabled}
              >
                <option value="ar">العربية (التفسير الميسر)</option>
                <option value="en">الإنجليزية</option>
                <option value="fr">الفرنسية</option>
                <option value="tr">التركية</option>
                <option value="ur">الأوردية</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* التلاوة والصوت */}
        <motion.div
          variants={itemVariants}
          className="bg-base-200 p-6 rounded-lg"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Volume className="ml-2" />
            التلاوة والصوت
          </h2>

          <div className="form-control">
            <div className="py-3 border-b border-base-300">
              <div className="mb-2">
                <h3 className="font-medium">صوت القارئ</h3>
                <p className="text-sm text-base-content/70">
                  اختيار القارئ المفضل
                </p>
              </div>
              <select
                className="select select-bordered w-full"
                value={state.reciterVoice}
                onChange={e => changeReciter(e.target.value)}
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

        {/* إعادة ضبط الإعدادات */}
        <motion.div
          variants={itemVariants}
          className="bg-base-200 p-6 rounded-lg"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <RotateCcw className="ml-2" />
            إعادة ضبط الإعدادات
          </h2>

          <div className="form-control">
            <button
              className="btn btn-error btn-block"
              onClick={() => setShowResetConfirm(true)}
            >
              <Trash2 className="mr-2" />
              إعادة ضبط
            </button>

            {showResetConfirm && (
              <div className="mt-4 p-4 bg-base-300 rounded-lg">
                <p className="text-sm text-base-content/70 mb-4">
                  هل أنت متأكد أنك تريد إعادة ضبط جميع الإعدادات؟
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowResetConfirm(false)}
                  >
                    إلغاء
                  </button>
                  <button className="btn btn-error" onClick={resetSettings}>
                    تأكيد
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* حفظ الإعدادات */}
        <motion.div
          variants={itemVariants}
          className="bg-base-200 p-6 rounded-lg"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Save className="ml-2" />
            حفظ الإعدادات
          </h2>

          <div className="form-control">
            <button
              className="btn btn-primary btn-block"
              onClick={saveSettings}
            >
              <Check className="mr-2" />
              حفظ
            </button>

            {saveSuccess && (
              <div className="mt-4 p-4 bg-base-300 rounded-lg">
                <p className="text-sm text-base-content/70">
                  تم حفظ الإعدادات بنجاح!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
