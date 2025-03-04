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
    fetchWithTimeout(`${API.quran}/ayah/${ayahNumber}/editions/ar.jalalayn`)
};
