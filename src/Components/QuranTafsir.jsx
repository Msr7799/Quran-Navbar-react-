import React, { useState, useEffect } from 'react';
import { API } from '../utils/api';
import { FaBook } from 'react-icons/fa';

const QuranTafsir = () => {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [tafsir, setTafsir] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const data = await API.getSurahs();
        setSurahs(data.suwar || []);
      } catch (error) {
        console.error('Error loading surahs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSurahs();
  }, []);

  const handleSurahSelect = async surahId => {
    setLoading(true);
    try {
      const data = await API.getTafsir(surahId);
      setTafsir(data);
      setSelectedSurah(surahId);
    } catch (error) {
      console.error('Error loading tafsir:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className='loading loading-spinner loading-lg'></div>;
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-col md:flex-row gap-4'>
        {/* قائمة السور */}
        <div className='w-full md:w-1/3'>
          <div className='card bg-base-200'>
            <div className='card-body'>
              <h3 className='card-title mb-4'>اختر السورة</h3>
              <div className='space-y-2'>
                {surahs.map(surah => (
                  <button
                    key={surah.number}
                    className={`btn btn-block ${
                      selectedSurah === surah.number
                        ? 'btn-primary'
                        : 'btn-ghost'
                    }`}
                    onClick={() => handleSurahSelect(surah.number)}
                  >
                    <FaBook className='mr-2' />
                    {surah.name?.ar || surah.name_ar}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* عرض التفسير */}
        <div className='w-full md:w-2/3'>
          {tafsir ? (
            <div className='card bg-base-200'>
              <div className='card-body'>
                <h2 className='card-title text-2xl mb-4'>
                  {surahs.find(s => s.number === selectedSurah)?.name?.ar}
                </h2>
                <div className='prose max-w-none'>{tafsir.content}</div>
              </div>
            </div>
          ) : (
            <div className='card bg-base-200'>
              <div className='card-body'>
                <p className='text-center'>اختر سورة لعرض تفسيرها</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuranTafsir;
