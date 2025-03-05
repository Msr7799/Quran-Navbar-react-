import React, { createContext, useContext, useReducer, useEffect } from 'react';

// إنشاء سياق الثيم
const ThemeContext = createContext();

// قائمة الثيمات المدعومة من daisyUI
export const AVAILABLE_THEMES = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter'
];

// قائمة الخطوط المتاحة
export const AVAILABLE_FONTS = [
  { name: 'Amiri Quran', value: 'Amiri Quran, serif' },
  { name: 'Scheherazade New', value: 'Scheherazade New, serif' },
  { name: 'Noto Naskh Arabic', value: 'Noto Naskh Arabic, serif' },
  { name: 'Traditional Arabic', value: 'Traditional Arabic, serif' },
  {
    name: 'KFGQPC Uthmanic Script HAFS',
    value: 'KFGQPC Uthmanic Script HAFS, serif'
  },
  { name: 'Lateef', value: 'Lateef, serif' }
];

// المخفض لإدارة حالة الثيم
const themeReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_THEME':
      return {
        ...state,
        theme: action.payload
      };
    case 'UPDATE_FONT':
      return {
        ...state,
        fontFamily: action.payload.fontFamily,
        fontSize: action.payload.fontSize,
        lineSpacing: action.payload.lineSpacing
      };
    case 'UPDATE_LANGUAGE':
      return {
        ...state,
        language: action.payload.language,
        quranLanguage: action.payload.quranLanguage
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

// القيم الافتراضية
const defaultSettings = {
  theme: 'light',
  fontFamily: 'Amiri Quran, serif',
  fontSize: 20,
  lineSpacing: 1.8,
  language: 'ar',
  quranLanguage: 'ar',
  showTranslation: true,
  showWordByWord: true,
  defaultReciterId: '',
  defaultRewayaId: '',
  defaultTafsirId: ''
};

// مزود الثيم
export const ThemeProvider = ({ children }) => {
  // استعادة القيم المحفوظة سابقاً من التخزين المحلي
  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('quranAppSettings');
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    } catch (error) {
      console.error('Error loading settings from localStorage', error);
      return defaultSettings;
    }
  };

  const [state, dispatch] = useReducer(themeReducer, loadSettings());

  // حفظ الإعدادات في التخزين المحلي عند تغييرها
  useEffect(() => {
    localStorage.setItem('quranAppSettings', JSON.stringify(state));
    applySettings(state);
  }, [state]);

  // تطبيق الإعدادات على المستند
  const applySettings = settings => {
    // تطبيق الثيم
    document.documentElement.setAttribute('data-theme', settings.theme);

    // تطبيق الوضع الداكن/الفاتح إذا كان مطلوبًا
    if (
      settings.theme === 'dark' ||
      settings.theme === 'night' ||
      settings.theme === 'dracula' ||
      settings.theme === 'black' ||
      settings.theme === 'luxury'
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // تطبيق الخط
    document.documentElement.style.setProperty(
      '--quran-font-family',
      settings.fontFamily
    );
    document.documentElement.style.setProperty(
      '--quran-font-size',
      `${settings.fontSize}px`
    );
    document.documentElement.style.setProperty(
      '--quran-line-spacing',
      settings.lineSpacing
    );

    // تطبيق اتجاه النص حسب اللغة
    if (
      settings.language === 'ar' ||
      settings.language === 'ur' ||
      settings.language === 'fa'
    ) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  // تطبيق الإعدادات عند تحميل التطبيق
  useEffect(() => {
    applySettings(state);

    // إضافة CSS عام للخطوط في الصفحة
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      body {
        font-family: var(--quran-font-family, 'Amiri Quran', serif);
        line-height: var(--quran-line-spacing, 1.8);
      }
      .quran-text {
        font-family: var(--quran-font-family, 'Amiri Quran', serif);
        font-size: var(--quran-font-size, 20px);
        line-height: var(--quran-line-spacing, 1.8);
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
};

// استخدام سياق الثيم
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
