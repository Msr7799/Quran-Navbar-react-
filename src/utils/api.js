/**
 * ملف خدمات API للتواصل مع الخادم
 * يوفر دوال لجلب بيانات القرآن الكريم والصوتيات
 */

const API_BASE_URL = 'https://api.quran.com/api/v4';
const AUDIO_BASE_URL = 'https://verses.quran.com';
const API_BASE = 'https://mp3quran.net/api/v3';
const QURAN_API = 'https://api.alquran.cloud/v1';

// إضافة تأخير للمحاكاة في بيئة التطوير
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper function for making API requests with timeout and error handling
 */
export const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again later.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * API endpoints
 */
export const API = {
  baseUrl: 'https://www.mp3quran.net/api/v3',
  quran: 'https://api.alquran.cloud/v1',

  getReciters: (language = 'ar') =>
    fetchWithTimeout(`${API.baseUrl}/reciters?language=${language}`),

  getReciterMoshafs: (reciterId, language = 'ar') =>
    fetchWithTimeout(
      `${API.baseUrl}/reciters?language=${language}&reciter=${reciterId}`
    ),

  getSurahs: () => fetchWithTimeout(`${API.baseUrl}/suwar`),

  searchVerses: (query, language = 'ar') =>
    fetchWithTimeout(`${API.quran}/search/${query}/all/${language}`),

  getTafsir: ayahNumber =>
    fetchWithTimeout(`${API.quran}/ayah/${ayahNumber}/editions/ar.jalalayn`),

  // Additional API functions for Quran pages
  getAllPages: () => fetchWithTimeout('/data/pagesQuran.json'),

  getRadios: (language = 'ar') => {
    const mockRadios = {
      radios: [
        {
          id: 1,
          name: 'إذاعة القرآن الكريم من القاهرة',
          url: 'https://stream.radiojar.com/8s5u5tpdtwzuv'
        },
        {
          id: 2,
          name: 'إذاعة القرآن الكريم من مكة المكرمة',
          url: 'https://stream.radiojar.com/4wqre23fytzuv'
        }
      ]
    };
    return Promise.resolve(mockRadios);
  }
};

export default API;

/**
 * واجهة برمجة التطبيق للقرآن الكريم
 * تتضمن خدمات جلب البيانات من ملفات القرآن المحلية والخدمات الخارجية
 */

const getReciters = async () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      // البيانات المحلية للقراء
      return {
        reciters: [
          { id: 1, name: 'عبد الباسط عبد الصمد', country: 'مصر' },
          { id: 2, name: 'محمود خليل الحصري', country: 'مصر' },
          { id: 3, name: 'محمد صديق المنشاوي', country: 'مصر' }
          // ...المزيد من القراء
        ]
      };
    }

    const response = await fetch(`${API_BASE_URL}/reciters`);
    if (!response.ok) throw new Error('Failed to fetch reciters');
    return await response.json();
  } catch (error) {
    console.error('Error fetching reciters:', error);
    return { reciters: [] };
  }
};
