import React, { useState, useEffect, useRef } from 'react';
import { API } from '../utils/api';
import { Link } from 'react-router-dom';

const Radio = () => {
  const [radios, setRadios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentRadio, setCurrentRadio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState('ar');
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchRadios = async () => {
      try {
        setLoading(true);
        const data = await API.getRadios(language);
        setRadios(data.radios || []);
      } catch (err) {
        console.error('Error fetching radio stations:', err);
        setError('حدث خطأ أثناء تحميل محطات الراديو. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    fetchRadios();
  }, [language]);

  const handleRadioSelect = radio => {
    setCurrentRadio(radio);

    if (audioRef.current) {
      audioRef.current.src = radio.url;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        });
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        إذاعات القرآن الكريم
      </h1>

      <div className="mb-6 flex justify-center">
        <select
          className="form-select p-2 border rounded-md"
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="ar">العربية</option>
          <option value="eng">English</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="loader"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="flex flex-col space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">المشغل</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                disabled={!currentRadio}
                className={`p-4 rounded-full ${
                  !currentRadio
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <div>
                <h3 className="font-bold text-lg">
                  {currentRadio ? currentRadio.name : 'لم يتم اختيار إذاعة'}
                </h3>
                <p className="text-gray-500">
                  {currentRadio ? 'جاري التشغيل...' : 'اختر إذاعة للاستماع'}
                </p>
              </div>
            </div>
            <audio ref={audioRef} className="hidden"></audio>
          </div>

          <h2 className="text-xl font-bold">قائمة الإذاعات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {radios.map((radio, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  currentRadio && currentRadio.id === radio.id
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-700 hover:shadow-lg'
                }`}
                onClick={() => handleRadioSelect(radio)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold">{radio.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">الراديو</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/quran-radio"
            className="card bg-base-200 hover:bg-base-300 cursor-pointer"
          >
            <div className="card-body">
              <h3 className="card-title">إذاعة القرآن الكريم</h3>
              <p>استمع إلى القرآن الكريم على مدار الساعة</p>
            </div>
          </Link>
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title">إذاعات إسلامية</h3>
              <p>قريبًا - مجموعة من الإذاعات الإسلامية المتنوعة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Radio;
