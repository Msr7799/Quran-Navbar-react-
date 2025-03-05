import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../utils/api';
import { motion } from 'framer-motion';
import {
  Search,
  Globe,
  Mic,
  Book,
  BookOpen,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Compass,
  BookText,
  Music,
  Loader2
} from 'lucide-react';

const QuranPlayer = () => {
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [audioVolume, setAudioVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // use dark mode
  const isDarkMode = document.body.classList.contains('dark-mode');

  document.documentElement.classList.toggle('dark-mode', isDarkMode);
  document.documentElement.classList.toggle('light-mode', !isDarkMode);
  document.documentElement.setAttribute(
    'data-theme-mode',
    isDarkMode ? 'dark' : 'light'
  );

  useEffect(() => {
    getReciters();
  }, [language]);

  const getReciters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await API.getReciters(language);
      setReciters(data.reciters || []);
    } catch (err) {
      setError('Error loading reciters: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMoshafs = async reciterId => {
    try {
      setLoading(true);
      setError(null);
      const data = await API.getReciterMoshafs(reciterId, language);
      if (data.reciters && data.reciters.length > 0) {
        setMoshafs(data.reciters[0].moshaf || []);
      } else {
        setMoshafs([]);
      }
    } catch (err) {
      setError('Error loading moshafs: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSurahs = async (surahServer, surahList) => {
    try {
      setLoading(true);
      setError(null);
      const data = await API.getSurahs();
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
      setError('Error loading surahs: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const playSurah = surahMp3 => {
    const audioPlayer = document.querySelector('#audioPlayer');
    audioPlayer.src = surahMp3;
    setCurrentAudio(surahMp3);
    audioPlayer.play();
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    const audioPlayer = document.querySelector('#audioPlayer');
    if (isPlaying) {
      audioPlayer.pause();
      setIsPlaying(false);
    } else {
      audioPlayer.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = e => {
    const volume = parseFloat(e.target.value);
    setAudioVolume(volume);
    const audioPlayer = document.querySelector('#audioPlayer');
    if (audioPlayer) {
      audioPlayer.volume = volume;
      setIsMuted(volume === 0);
    }
  };

  const toggleMute = () => {
    const audioPlayer = document.querySelector('#audioPlayer');
    if (audioPlayer) {
      if (isMuted) {
        audioPlayer.volume = audioVolume || 1;
        setIsMuted(false);
      } else {
        audioPlayer.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const searchVerses = async e => {
    e.preventDefault();
    const searchTitle = document.querySelector('#searchTitle').value;

    try {
      setLoading(true);
      setError(null);
      const data = await API.searchVerses(searchTitle, language);

      const results = await Promise.all(
        data.data.matches.map(async match => {
          try {
            const tafsirData = await API.getTafsir(match.number);
            return {
              surah: match.surah.name,
              numberInSurah: match.numberInSurah,
              text: match.text,
              tafsir: tafsirData.data[0].text
            };
          } catch (error) {
            console.error('Error fetching tafsir:', error);
            return {
              surah: match.surah.name,
              numberInSurah: match.numberInSurah,
              text: match.text,
              tafsir: 'تفسير غير متاح'
            };
          }
        })
      );

      setSearchResults(results);
    } catch (err) {
      setError('Error searching verses: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="bg-gradient-to-br from-base-200/80 to-base-100 backdrop-blur-sm shadow-xl rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Background decorative element */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L100,0 L100,100 L0,100 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="5,5"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold font-arabic bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            مشغل القرآن الكريم
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-2"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="flex flex-col lg:flex-row bg-base-100/50 backdrop-blur-md rounded-xl shadow-lg p-6 border border-base-300/40"
        >
          <div className="w-full">
            <motion.form
              variants={containerVariants}
              className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between gap-4"
              id="search-form"
              name="gs"
              method="submit"
              role="search"
              onSubmit={searchVerses}
            >
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
              >
                <motion.div variants={itemVariants} className="flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <Globe size={16} className="text-primary" />
                      اختر اللغة
                    </span>
                  </label>
                  <select
                    id="chooseLanguage"
                    className="select select-bordered w-full bg-base-100 focus:ring-2 focus:ring-primary/50 transition-all"
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                  >
                    <option value="ar">العربية</option>
                    <option value="eng">الإنجليزية</option>
                  </select>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col">
                  <div className="w-full">
                    <label className="label">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <Search size={16} className="text-primary" />
                        أبحث في القرآن
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="searchTitle"
                        id="searchTitle"
                        className="input input-bordered w-full pr-10 bg-base-100 focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="أكتب كلمة البحث"
                        autoComplete="on"
                      />
                      <button
                        type="submit"
                        className="absolute left-2 top-1/2 -translate-y-1/2 btn btn-sm btn-circle btn-ghost text-primary hover:text-secondary transition-colors"
                      >
                        <Search size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <Mic size={16} className="text-primary" />
                      أختر القارئ
                    </span>
                  </label>
                  <select
                    name="Category"
                    id="chooseReciter"
                    className="select select-bordered w-full bg-base-100 focus:ring-2 focus:ring-primary/50 transition-all"
                    onChange={e => {
                      setSelectedReciter(e.target.value);
                      getMoshafs(e.target.value);
                    }}
                  >
                    <option value="">اختر قارئ</option>
                    {reciters.map(reciter => (
                      <option key={reciter.id} value={reciter.id}>
                        {reciter.name}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <Book size={16} className="text-primary" />
                      أختر الرواية
                    </span>
                  </label>
                  <select
                    id="chooseMoshaf"
                    className="select select-bordered w-full bg-base-100 focus:ring-2 focus:ring-primary/50 transition-all"
                    onChange={e => {
                      const selectedOption = e.target.selectedOptions[0];
                      const surahServer = selectedOption.dataset.server;
                      const surahList = selectedOption.dataset.suraList;
                      getSurahs(surahServer, surahList);
                    }}
                  >
                    <option value="">اختر رواية</option>
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
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <BookOpen size={16} className="text-primary" />
                      أختر السورة
                    </span>
                  </label>
                  <select
                    name="Price"
                    id="chooseSurah"
                    className="select select-bordered w-full bg-base-100 focus:ring-2 focus:ring-primary/50 transition-all"
                    onChange={e => playSurah(e.target.value)}
                  >
                    <option value="">اختر سورة</option>
                    {surahs.map(surah => (
                      <option key={surah.id} value={surah.url}>
                        {surah.name}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-end gap-2"
                >
                  <Link to="/qibla" className="btn btn-primary flex-1">
                    <Compass size={18} />
                    القبلة
                  </Link>
                  <Link
                    to="/quran/pages"
                    className="btn btn-outline btn-secondary flex-1"
                  >
                    <BookText size={18} />
                    المصحف
                  </Link>
                </motion.div>
              </motion.div>
            </motion.form>

            <motion.div className="mt-12 mb-6" variants={fadeIn}>
              {/* Custom Player UI */}
              <div className="bg-base-200/80 backdrop-blur-md rounded-xl shadow-xl p-4 border border-base-300/30">
                {/* Visualizer */}
                <div className="h-12 mb-3 flex items-end justify-center gap-[2px]">
                  {isPlaying
                    ? // Audio wave animation
                      [...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 rounded-full bg-primary"
                          animate={{
                            height: [
                              5,
                              Math.random() * 30 + 5,
                              Math.random() * 20 + 5,
                              Math.random() * 40 + 5,
                              5
                            ]
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            delay: i * 0.05
                          }}
                        />
                      ))
                    : // Static bars when not playing
                      [...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-2 rounded-full bg-base-300"
                        />
                      ))}
                </div>

                {/* Controls & Player */}
                <div className="flex items-center gap-4 justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlayPause}
                    className="btn btn-circle btn-primary"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </motion.button>

                  <div className="flex flex-col flex-grow gap-1">
                    <audio
                      ref={ref => {
                        const audioPlayer =
                          document.querySelector('#audioPlayer');
                        // Don't override existing audio element
                        if (!audioPlayer) {
                          const audio = document.createElement('audio');
                          audio.id = 'audioPlayer';
                          audio.className = 'hidden';
                          document.body.appendChild(audio);
                        }
                      }}
                      className="hidden"
                      id="audioPlayer"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                    />

                    {/* Filename display */}
                    <div className="text-sm opacity-70 text-center">
                      {currentAudio ? (
                        <div className="overflow-hidden h-6">
                          <motion.div
                            initial={{ x: 50 }}
                            animate={{
                              x: currentAudio.length > 30 ? [-300, 50] : 0
                            }}
                            transition={{
                              duration: currentAudio.length > 30 ? 10 : 0,
                              repeat: Infinity,
                              repeatType: 'reverse'
                            }}
                          >
                            {currentAudio.split('/').pop()}
                          </motion.div>
                        </div>
                      ) : (
                        'لم يتم اختيار سورة'
                      )}
                    </div>

                    {/* Custom progress bar - since we can't manipulate the actual audio element */}
                    <div className="w-full bg-base-300 h-1 rounded-full">
                      <motion.div
                        className="bg-primary h-1 rounded-full"
                        animate={
                          isPlaying
                            ? { width: ['0%', '100%'] }
                            : { width: '0%' }
                        }
                        transition={
                          isPlaying
                            ? { duration: 100, repeat: Infinity }
                            : { duration: 0 }
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-circle btn-sm btn-ghost"
                      onClick={toggleMute}
                    >
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : audioVolume}
                      onChange={handleVolumeChange}
                      className="range range-xs range-primary w-20"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Loading indicator */}
            {loading && (
              <motion.div
                className="flex justify-center my-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className="text-primary"
                >
                  <Loader2 size={36} />
                </motion.div>
              </motion.div>
            )}

            {/* Error message */}
            {error && (
              <motion.div
                className="alert alert-error my-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex-1">
                  <label>{error}</label>
                </div>
              </motion.div>
            )}

            {/* Search results with staggered animation */}
            <motion.div
              variants={containerVariants}
              id="verseResults"
              className="mt-6 space-y-4"
            >
              {searchResults.map((result, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-6 rounded-xl bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-300/30 backdrop-blur-sm"
                >
                  <div className="flex gap-4 items-start">
                    <div className="bg-primary/10 p-3 rounded-full text-primary h-12 w-12 flex items-center justify-center">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2 text-lg">
                        {result.surah} - الآية {result.numberInSurah}
                      </h3>
                      <p className="mb-3 text-lg font-arabic">{result.text}</p>
                      <div className="bg-base-200/50 p-4 rounded-lg mt-2 text-sm">
                        <h4 className="font-semibold mb-1 text-primary">
                          التفسير:
                        </h4>
                        <p className="leading-relaxed">{result.tafsir}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuranPlayer;
