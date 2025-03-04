import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Updated API URL with www
const apiUrl = 'https://www.mp3quran.net/api/v3';

const QuranNavbar = () => {
  const [language, setLanguage] = useState('ar');
  const [reciters, setReciters] = useState([]);
  const [moshafs, setMoshafs] = useState([]);
  const [surahs, setSurahs] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState(null);
  const [selectedMoshaf, setSelectedMoshaf] = useState(null);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getReciters();
  }, [language]);
  // use dark mode
  const isDarkMode = document.body.classList.contains('dark-mode');

  document.documentElement.classList.toggle('dark-mode', isDarkMode);
  document.documentElement.classList.toggle('light-mode', !isDarkMode);
  document.documentElement.setAttribute(
    'data-theme-mode',
    isDarkMode ? 'dark' : 'light'
  );
  const getReciters = async () => {
    try {
      setLoading(true);
      setError(null);
      // Set timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch(`${apiUrl}/reciters?language=${language}`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok)
        throw new Error(`Failed to fetch reciters (Status: ${res.status})`);
      const data = await res.json();
      setReciters(data.reciters || []);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timeout. Please try again.');
      } else {
        setError('Error loading reciters: ' + err.message);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMoshafs = async reciterId => {
    try {
      setLoading(true);
      setError(null);
      // Set timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch(
        `${apiUrl}/reciters?language=${language}&reciter=${reciterId}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!res.ok)
        throw new Error(`Failed to fetch moshafs (Status: ${res.status})`);
      const data = await res.json();
      if (data.reciters && data.reciters.length > 0) {
        setMoshafs(data.reciters[0].moshaf || []);
      } else {
        setMoshafs([]);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timeout. Please try again.');
      } else {
        setError('Error loading moshafs: ' + err.message);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSurahs = async (surahServer, surahList) => {
    try {
      setLoading(true);
      setError(null);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch('https://www.mp3quran.net/api/v3/suwar', {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok)
        throw new Error(`Failed to fetch surahs (Status: ${res.status})`);
      const data = await res.json();
      const surahNames = data.suwar;
      const surahArray = surahList.split(',');

      const surahOptions = surahArray.map(surah => {
        const padSurah = surah.padStart(3, '0');
        const surahName = surahNames.find(surahName => surahName.id == surah);
        return {
          id: surah,
          name: surahName ? surahName.name : `Surah ${surah}`,
          url: `${surahServer}${padSurah}.mp3`
        };
      });

      setSurahs(surahOptions);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timeout. Please try again.');
      } else {
        setError('Error loading surahs: ' + err.message);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const playSurah = surahMp3 => {
    const audioPlayer = document.querySelector('#audioPlayer');
    audioPlayer.src = surahMp3;
    audioPlayer.play();
  };

  const searchVerses = async e => {
    e.preventDefault();
    const searchTitle = document.querySelector('#searchTitle').value;
    const res = await fetch(
      `https://api.alquran.cloud/v1/search/${searchTitle}/all/${language}`
    );
    const data = await res.json();
    const results = data.data.matches.map(async match => {
      const tafsirRes = await fetch(
        `https://api.alquran.cloud/v1/ayah/${match.number}/editions/ar.jalalayn`
      );
      const tafsirData = await tafsirRes.json();
      return {
        surah: match.surah.name,
        numberInSurah: match.numberInSurah,
        text: match.text,
        tafsir: tafsirData.data[0].text
      };
    });
    setSearchResults(await Promise.all(results));
  };

  return (
    <div
      data-theme='{theme}'
      className='search-form border-4 flex flex-col w-full p-4'
    >
      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row'>
          <div className='w-full'>
            <form
              className='flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between'
              id='search-form'
              name='gs'
              method='submit'
              role='search'
              onSubmit={searchVerses}
            >
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full'>
                <div className='flex flex-col'>
                  <fieldset>
                    <p
                      htmlFor='chooseLanguage '
                      className='form-p quran-title mb-2'
                    >
                      اختر اللغة
                    </p>
                    <select
                      id='chooseLanguage'
                      className='form-select text-zinc-800 w-full p-2'
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                    >
                      <option value='ar'>العربية</option>
                      <option value='eng'>الإنجليزية</option>
                    </select>
                  </fieldset>
                </div>

                <div className='flex flex-col'>
                  <fieldset className='w-full'>
                    <p
                      htmlFor='searchTitle'
                      className='form-p quran-title mb-2'
                    >
                      أبحث في القرآن
                    </p>
                    <input
                      type='text'
                      name='searchTitle'
                      id='searchTitle'
                      className='searchText w-full p-2'
                      placeholder='أكتب كلمة البحث'
                      autoComplete='on'
                    />
                    <button className='btn btn-ghost btn-circle'>
                      <div className='indicator'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          {' '}
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                          />{' '}
                        </svg>
                        <span className='badge badge-xs badge-primary indicator-item'></span>
                      </div>
                    </button>
                  </fieldset>
                </div>

                <div className='flex flex-col'>
                  <fieldset className='w-full'>
                    <p
                      htmlFor='chooseReciter'
                      className='form-p quran-title mb-2'
                    >
                      أختر القارئ
                    </p>
                    <select
                      name='Category'
                      id='chooseReciter'
                      className='form-select w-full p-2 text-zinc-800'
                      onChange={e => {
                        setSelectedReciter(e.target.value);
                        getMoshafs(e.target.value);
                      }}
                    >
                      <option value=''>اختر قارئ</option>
                      {reciters.map(reciter => (
                        <option key={reciter.id} value={reciter.id}>
                          {reciter.name}
                        </option>
                      ))}
                    </select>
                  </fieldset>
                </div>

                <div className='flex flex-col'>
                  <fieldset className='w-full'>
                    <p
                      htmlFor='chooseMoshaf'
                      className='form-p quran-title mb-2'
                    >
                      أختر الرواية
                    </p>
                    <select
                      id='chooseMoshaf'
                      className='form-control w-full p-2 text-zinc-800'
                      onChange={e => {
                        const selectedOption = e.target.selectedOptions[0];
                        const surahServer = selectedOption.dataset.server;
                        const surahList = selectedOption.dataset.suraList;
                        getSurahs(surahServer, surahList);
                      }}
                    >
                      <option value=''>اختر رواية</option>
                      {moshafs.map(moshaf => (
                        <option
                          key={moshaf.id}
                          value={moshaf.id}
                          data-server={moshaf.server}
                          data-sura-list={moshaf.surah_list}
                        >
                          {moshaf.name}
                        </option>
                      ))}
                    </select>
                  </fieldset>
                </div>

                <div className='flex flex-col'>
                  <fieldset className='w-full'>
                    <p
                      htmlFor='chooseSurah'
                      className='form-p quran-title mb-2'
                    >
                      أختر السورة
                    </p>
                    <select
                      name='Price'
                      id='chooseSurah'
                      className='form-select w-full p-2 text-zinc-800'
                      onChange={e => playSurah(e.target.value)}
                    >
                      <option value=''>اختر سورة</option>
                      {surahs.map(surah => (
                        <option key={surah.id} value={surah.url}>
                          {surah.name}
                        </option>
                      ))}
                    </select>
                  </fieldset>
                </div>
                <div className='flex flex-col text-4xl text-center'>
                  <Link to='/qibla' className='btn btn-ghost btn-circle'>
                    قبلة
                  </Link>
                </div>
              </div>
              <div className='flex justify-end'>
                <Link to='/quran/pages'>صفحات القرآن</Link>
              </div>
            </form>

            <div className='play-bar mt-10 bottom-4 left-4 right-4  border-2 border-sky-500 bg-white'>
              <audio
                controls
                onPlay={() => console.log('playing')}
                className='w-full h-full play-inner'
                id='audioPlayer'
              >
                <source src='' type='audio/ogg' />
                <source src='' type='audio/mpeg' />
                Your browser does not support the audio element.
              </audio>
            </div>

            <div id='verseResults' className='mt-4'>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className='mb-4 p-4 border rounded bg-base-100 shadow'
                >
                  <div className='mb-2 font-bold'>
                    {result.surah} - {result.numberInSurah}: {result.text}
                  </div>
                  <div className='text-sm text-gray-600'>
                    تفسير: {result.tafsir}
                  </div>
                </div>
              ))}
            </div>
            {error && <div className='text-red-500 p-4'>{error}</div>}
            {loading && <div className='text-blue-500 p-4'>Loading...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuranNavbar;
