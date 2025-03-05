import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchQuran } from '../services/quranService';

const QuranSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('ar');

  const handleSearch = async e => {
    e.preventDefault();

    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await searchQuran(searchTerm, language);
      setResults(data);

      if (data.length === 0) {
        setError('لم يتم العثور على نتائج مطابقة للبحث.');
      }
    } catch (error) {
      console.error('خطأ في البحث:', error);
      setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="container mx-auto py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center">
        البحث في القرآن الكريم
      </h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="form-control flex-grow">
            <div className="input-group">
              <input
                type="text"
                placeholder="أدخل كلمة أو جملة للبحث..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                dir="rtl"
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin" /> : <Search />}
              </button>
            </div>
          </div>

          <div className="form-control md:w-32">
            <select
              className="select select-bordered"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </form>

      {error && (
        <div className="alert alert-info mb-6">
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
          <span>{error}</span>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-xl font-semibold mb-4">
            نتائج البحث ({results.length} سورة)
          </h2>

          {results.map(surah => (
            <div
              key={surah.number}
              className="card bg-base-100 shadow-md border border-base-300"
            >
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <h3 className="card-title">
                    <span className="badge badge-primary">{surah.number}</span>
                    <span>{surah.name.ar}</span>
                    <span className="text-sm opacity-70">
                      ({surah.name.en})
                    </span>
                  </h3>

                  <Link
                    to={`/surah/${surah.number}`}
                    className="btn btn-sm btn-outline"
                  >
                    عرض السورة
                  </Link>
                </div>

                <div className="divider my-1"></div>

                <div className="space-y-4">
                  {surah.verses.map(verse => (
                    <div
                      key={verse.number}
                      className="p-3 bg-base-200 rounded-lg"
                    >
                      <div className="flex items-start gap-2">
                        <span className="badge badge-sm">{verse.number}</span>
                        <div>
                          <p className="text-lg" dir="rtl">
                            {verse.text.ar}
                          </p>
                          {language === 'en' && (
                            <p className="text-sm opacity-80 mt-1">
                              {verse.text.en}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default QuranSearch;
