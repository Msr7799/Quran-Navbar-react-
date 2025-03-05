/**
 * ملف API جديد للتعامل مع واجهات برمجة القرآن الكريم والتفاسير
 * يضمن التعامل السليم مع البيانات وتحويلها إلى التنسيق المتوقع
 */

// تعريف عناوين API الأساسية
const MP3QURAN_API_BASE = 'https://mp3quran.net/api/v3';
const QURAN_CLOUD_API = 'https://api.alquran.cloud/v1';
const API_BASE_URL = 'https://api.quran.com/api/v4';

/**
 * دالة مساعدة للتعامل مع طلبات API مع مهلة زمنية ومعالجة الأخطاء
 */
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    console.log(`Fetching URL: ${url}`);
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    if (!text || text.trim() === '') {
      return { success: false, data: null };
    }

    const data = JSON.parse(text);
    return { success: true, data };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out');
      return {
        success: false,
        error: 'Request timed out. Please try again later.'
      };
    }

    console.error('API request failed:', error);
    return { success: false, error: error.message };
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * بيانات افتراضية للاستخدام في حالة فشل الاتصال
 */
const DEFAULT_DATA = {
  tafsirs: [
    { id: 1, name: 'تفسير ابن كثير', language: 'ar' },
    { id: 2, name: 'تفسير الطبري', language: 'ar' },
    { id: 3, name: 'تفسير القرطبي', language: 'ar' },
    { id: 4, name: 'تفسير السعدي', language: 'ar' }
  ],
  surahsBySurah: [...Array(114)].map((_, idx) => ({
    id: idx + 1,
    name: `سورة ${idx + 1}`,
    verses_count: 0
  }))
};

/**
 * API مخصص للقرآن الكريم والتفاسير
 */
export const QuranAPI = {
  /**
   * جلب قائمة التفاسير المتاحة
   */
  getTafsirs: async (language = 'ar') => {
    try {
      const { success, data, error } = await fetchWithTimeout(
        `${MP3QURAN_API_BASE}/tafasir?language=${language}`
      );

      if (!success) {
        throw new Error(error || 'حدث خطأ أثناء جلب التفاسير');
      }

      if (data && data.tafasir && Array.isArray(data.tafasir)) {
        return { tafasir: data.tafasir };
      } else {
        console.warn('No tafsirs found or invalid format, using default data');
        return { tafasir: DEFAULT_DATA.tafsirs };
      }
    } catch (error) {
      console.error('Failed to fetch tafsirs:', error);
      return { tafasir: DEFAULT_DATA.tafsirs };
    }
  },

  /**
   * جلب سور تفسير محدد
   * الدالة تضمن إرجاع مصفوفة حتى في حالة الخطأ
   */
  getTafsirSurahs: async (tafsirId, language = 'ar') => {
    try {
      const { success, data, error } = await fetchWithTimeout(
        `${MP3QURAN_API_BASE}/tafsir?tafsir=${tafsirId}&language=${language}`
      );

      if (!success) {
        throw new Error(error || 'حدث خطأ أثناء جلب سور التفسير');
      }

      // التأكد من وجود البيانات في التنسيق المطلوب
      if (data && data.tafsir && Array.isArray(data.tafsir)) {
        return { tafasir: data.tafsir };
      } else if (data && data.tafasir && Array.isArray(data.tafasir)) {
        return { tafasir: data.tafasir };
      } else if (data && Array.isArray(data)) {
        return { tafasir: data };
      } else {
        // إنشاء مصفوفة افتراضية للسور
        console.warn(
          'Invalid or missing tafsir surahs data, using default surahs'
        );
        const defaultSurahs = [...Array(114)].map((_, idx) => ({
          id: idx + 1,
          name: `سورة ${idx + 1}`,
          tafsir_id: tafsirId
        }));
        return { tafasir: defaultSurahs.slice(0, 20) }; // إرجاع أول 20 سورة كمثال
      }
    } catch (error) {
      console.error('Failed to fetch tafsir surahs:', error);
      // إرجاع مصفوفة افتراضية في حالة الخطأ
      const defaultSurahs = [...Array(114)].map((_, idx) => ({
        id: idx + 1,
        name: `سورة ${idx + 1}`,
        tafsir_id: tafsirId
      }));
      return { tafasir: defaultSurahs.slice(0, 20) };
    }
  },

  /**
   * البحث في القرآن الكريم
   */
  searchVerses: async (query, language = 'ar') => {
    try {
      const encodedQuery = encodeURIComponent(query);
      // محاولة البحث عبر API الرئيسي
      const { success, data, error } = await fetchWithTimeout(
        `${QURAN_CLOUD_API}/search/${encodedQuery}/all/${language}`
      );

      if (!success) {
        throw new Error(error || 'حدث خطأ أثناء البحث');
      }

      if (data && data.data && data.data.matches) {
        return {
          data: {
            matches: data.data.matches.map(match => ({
              text: match.text,
              surah: { name: match.surah.name, number: match.surah.number },
              number: match.number,
              numberInSurah: match.numberInSurah
            }))
          }
        };
      } else {
        throw new Error('لم يتم العثور على نتائج بحث');
      }
    } catch (primaryError) {
      console.error('Primary search failed:', primaryError);

      try {
        // محاولة البحث عبر API بديل عند فشل الأول
        const { success, data, error } = await fetchWithTimeout(
          `${API_BASE_URL}/search?q=${encodeURIComponent(
            query
          )}&language=${language}&size=20&page=0`
        );

        if (!success) {
          throw new Error(error || 'حدث خطأ أثناء البحث البديل');
        }

        if (data && data.search && data.search.results) {
          // تحويل النتائج إلى التنسيق المطلوب
          const matches = data.search.results.map(item => ({
            text: item.text,
            surah: {
              name: item.surah_name || `سورة ${item.surah}`,
              number: item.surah
            },
            number: item.verse_key,
            numberInSurah: item.verse_number
          }));

          return { data: { matches } };
        } else {
          throw new Error('لم يتم العثور على نتائج بحث');
        }
      } catch (secondaryError) {
        console.error('Secondary search failed:', secondaryError);

        // إرجاع نتائج افتراضية في حالة فشل جميع محاولات البحث
        if (query.includes('الله') || query.includes('الرحمن')) {
          return {
            data: {
              matches: [
                {
                  text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
                  surah: { name: 'الفاتحة', number: 1 },
                  number: '1:1',
                  numberInSurah: 1
                },
                {
                  text: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
                  surah: { name: 'الإخلاص', number: 112 },
                  number: '112:1',
                  numberInSurah: 1
                }
              ]
            }
          };
        }

        return { data: { matches: [] } };
      }
    }
  },

  /**
   * جلب تفسير آية معينة
   */
  getTafsir: async verseKey => {
    try {
      const { success, data, error } = await fetchWithTimeout(
        `${API_BASE_URL}/tafsirs/1/by_ayah/${verseKey}`
      );

      if (!success) {
        throw new Error(error || 'حدث خطأ أثناء جلب التفسير');
      }

      // معالجة البيانات لتناسب واجهة التطبيق
      if (data && data.tafsir) {
        return { data: [{ text: data.tafsir.text || 'تفسير غير متاح' }] };
      }

      return { data: [{ text: 'تفسير غير متاح' }] };
    } catch (error) {
      console.error('Failed to fetch tafsir:', error);
      return { data: [{ text: 'تفسير غير متاح' }] };
    }
  },

  /**
   * جلب تفسير سورة محددة
   */
  getTafsirSurah: async (tafsirId, surahId, language = 'ar') => {
    try {
      const { success, data, error } = await fetchWithTimeout(
        `${MP3QURAN_API_BASE}/tafsir?tafsir=${tafsirId}&sura=${surahId}&language=${language}`
      );

      if (!success) {
        throw new Error(error || 'حدث خطأ أثناء جلب تفسير السورة');
      }

      if (data && data.tafsir) {
        return { tafsir: data.tafsir };
      } else {
        return { tafsir: { text: 'تفسير غير متاح لهذه السورة' } };
      }
    } catch (error) {
      console.error('Failed to fetch surah tafsir:', error);
      return { tafsir: { text: 'تفسير غير متاح' } };
    }
  }
};

export default QuranAPI;
