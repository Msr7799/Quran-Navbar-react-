import axios from 'axios';

// تعيين عنوان قاعدة API
const API_URL =
  process.env.NODE_ENV === 'production'
    ? '/api/quran'
    : 'http://localhost:5000/api/quran';

// إنشاء مثيل من axios مع الإعدادات الافتراضية
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// الحصول على جميع السور
export const getAllSurahs = async () => {
  try {
    const response = await apiClient.get('/surahs');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب السور:', error);
    throw error;
  }
};

// الحصول على سورة محددة بالرقم
export const getSurahByNumber = async surahNumber => {
  try {
    const response = await apiClient.get(`/surahs/${surahNumber}`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في جلب السورة رقم ${surahNumber}:`, error);
    throw error;
  }
};

// الحصول على آيات سورة محددة
export const getSurahVerses = async surahNumber => {
  try {
    const response = await apiClient.get(`/surahs/${surahNumber}/verses`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في جلب آيات السورة رقم ${surahNumber}:`, error);
    throw error;
  }
};

// الحصول على التلاوات الصوتية لسورة محددة
export const getSurahAudio = async surahNumber => {
  try {
    const response = await apiClient.get(`/surahs/${surahNumber}/audio`);
    return response.data;
  } catch (error) {
    console.error(
      `خطأ في جلب التلاوات الصوتية للسورة رقم ${surahNumber}:`,
      error
    );
    throw error;
  }
};

// البحث في القرآن
export const searchQuran = async (query, language = 'ar') => {
  try {
    const response = await apiClient.get(`/search`, {
      params: { query, language }
    });
    return response.data;
  } catch (error) {
    console.error('خطأ في البحث في القرآن:', error);
    throw error;
  }
};

export default {
  getAllSurahs,
  getSurahByNumber,
  getSurahVerses,
  getSurahAudio,
  searchQuran
};
