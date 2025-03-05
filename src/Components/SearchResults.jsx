import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowRight,
  AlertTriangle,
  BookOpen,
  Loader
} from 'lucide-react';

const SearchResults = () => {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [surahs, setSurahs] = useState({});

  // استخراج أسماء السور من JSON
  useEffect(() => {
    fetch('/data/surahs.json')
      .then(response => response.json())
      .then(data => {
        const surahsMap = {};
        data.forEach(surah => {
          surahsMap[surah.number] = surah;
        });
        setSurahs(surahsMap);
      })
      .catch(err => {
        console.error('Error loading surahs data:', err);
        setError('حدث خطأ أثناء تحميل بيانات السور');
      });
  }, []);

  // البحث في القرآن (محاكاة)
  useEffect(() => {
    setLoading(true);
    setError(null);

    // محاكاة طلب API - في التطبيق الحقيقي هنا يكون هناك اتصال بـ API للبحث
    setTimeout(() => {
      fetch('/data/quran_text.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('فشل في تحميل بيانات القرآن');
          }
          return response.json();
        })
        .then(quranData => {
          const decodedQuery = decodeURIComponent(query).trim();

          if (!decodedQuery) {
            setResults([]);
            setLoading(false);
            return;
          }

          const searchResults = [];
          const normalizedQuery = decodedQuery.replace(/[َُِّْ]/g, '');

          // البحث في النص القرآني
          for (const surahId in quranData) {
            if (quranData.hasOwnProperty(surahId)) {
              const surah = quranData[surahId];
              for (const verseId in surah.verses) {
                if (surah.verses.hasOwnProperty(verseId)) {
                  const verse = surah.verses[verseId];
                  const normalizedText = verse.text.replace(/[َُِّْ]/g, '');

                  if (normalizedText.includes(normalizedQuery)) {
                    searchResults.push({
                      surahId: parseInt(surahId),
                      verseId: parseInt(verseId),
                      text: verse.text,
                      page: verse.page
                    });
                  }
                }
              }
            }
          }

          setResults(searchResults);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error in search:', err);
          setError(err.message);
          setLoading(false);
        });
    }, 1000); // محاكاة تأخير الشبكة
  }, [query]);

  // وظيفة لتمييز نص البحث في النتائج
  const highlightText = (text, query) => {
    if (!query) return text;

    const normalizedQuery = query.replace(/[َُِّْ]/g, '');
    const normalizedText = text;

    const parts = normalizedText.split(
      new RegExp(`(${normalizedQuery})`, 'gi')
    );

    return parts.map((part, i) => {
      const lowercasePart = part.replace(/[َُِّْ]/g, '').toLowerCase();
      const lowercaseQuery = normalizedQuery.toLowerCase();

      if (lowercasePart === lowercaseQuery.toLowerCase()) {
        return (
          <mark key={i} className="bg-yellow-200 px-0.5 rounded">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  // تكوينات الحركة
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link
          to="/search"
          className="flex items-center text-primary hover:underline ml-4"
        >
          <ArrowRight size={20} className="ml-1" />
          العودة للبحث
        </Link>
        <h1 className="text-2xl font-bold">
          نتائج البحث عن: "{decodeURIComponent(query)}"
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader size={40} className="text-primary animate-spin mb-4" />
          <p>جاري البحث...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-lg text-center shadow">
          <AlertTriangle className="mx-auto mb-4" size={40} />
          <p className="text-lg font-bold mb-2">حدث خطأ أثناء البحث</p>
          <p>{error}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-base-200 p-8 rounded-lg text-center">
          <Search className="mx-auto mb-4 text-gray-400" size={40} />
          <h2 className="text-xl font-bold mb-2">لا توجد نتائج</h2>
          <p>
            لم يتم العثور على نتائج تطابق كلمة البحث "
            {decodeURIComponent(query)}"
          </p>
          <Link to="/search" className="btn btn-primary mt-4">
            العودة وتجربة بحث آخر
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-6 text-base-content/70">
            تم العثور على {results.length} نتيجة
          </p>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {results.map((result, index) => (
              <motion.div
                key={`${result.surahId}-${result.verseId}-${index}`}
                variants={item}
                className="bg-base-100 rounded-lg p-4 shadow hover:shadow-md transition-shadow border border-base-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/viewer/${result.surahId}/${result.verseId}`}
                      className="font-bold text-lg hover:text-primary transition-colors"
                    >
                      سورة{' '}
                      {surahs[result.surahId]?.name || `#${result.surahId}`} -
                      الآية {result.verseId}
                    </Link>
                    {surahs[result.surahId] && (
                      <div className="text-xs text-base-content/60">
                        {surahs[result.surahId].revelationType === 'Meccan'
                          ? 'مكية'
                          : 'مدنية'}{' '}
                        - عدد الآيات: {surahs[result.surahId].numberOfAyahs}
                      </div>
                    )}
                  </div>
                  <Link
                    to={`/quran/pages?page=${result.page}`}
                    className="text-primary flex items-center hover:underline text-sm"
                  >
                    <BookOpen size={16} className="ml-1" />
                    صفحة {result.page}
                  </Link>
                </div>

                <p className="mt-3 text-right text-lg leading-8 font-quran">
                  {highlightText(result.text, query)}
                </p>

                <div className="mt-2 flex gap-2">
                  <Link
                    to={`/tafsir/${result.surahId}/${result.verseId}`}
                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors"
                  >
                    عرض التفسير
                  </Link>
                  <Link
                    to={`/reader/${result.surahId}?verse=${result.verseId}`}
                    className="text-xs bg-base-200 text-base-content px-2 py-1 rounded hover:bg-base-300 transition-colors"
                  >
                    قراءة السورة كاملة
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default SearchResults;
