import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RefreshCw,
  Heart,
  Headphones
} from 'lucide-react';

const QuranRadio = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  const audioRef = useRef(null);

  // قائمة محطات إذاعة القرآن
  const stationsList = [
    {
      id: 1,
      name: 'إذاعة القرآن الكريم من القاهرة',
      country: 'مصر',
      logo: '/images/stations/egypt.png',
      url: 'https://stream.radiojar.com/8s5u5tpdtwzuv'
    },
    {
      id: 2,
      name: 'إذاعة القرآن الكريم من مكة المكرمة',
      country: 'السعودية',
      logo: '/images/stations/saudi.png',
      url: 'https://stream.radiojar.com/4wqre23fytzuv'
    }
  ];

  useEffect(() => {
    setStations(stationsList);
    setLoading(false);
  }, []);

  const handleStationClick = station => {
    setCurrentStation(station);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = e => {
    setVolume(e.target.value);
    audioRef.current.volume = e.target.value;
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const handleFavorite = station => {
    if (favorites.includes(station.id)) {
      setFavorites(favorites.filter(fav => fav !== station.id));
    } else {
      setFavorites([...favorites, station.id]);
    }
  };

  const filteredStations =
    activeFilter === 'all'
      ? stations
      : stations.filter(station => station.country === activeFilter);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        إذاعات القرآن الكريم
      </h2>

      <div className="flex justify-center mb-4">
        <button
          className={`btn ${
            activeFilter === 'all' ? 'btn-primary' : 'btn-outline'
          }`}
          onClick={() => setActiveFilter('all')}
        >
          الكل
        </button>
        <button
          className={`btn ${
            activeFilter === 'مصر' ? 'btn-primary' : 'btn-outline'
          }`}
          onClick={() => setActiveFilter('مصر')}
        >
          مصر
        </button>
        <button
          className={`btn ${
            activeFilter === 'السعودية' ? 'btn-primary' : 'btn-outline'
          }`}
          onClick={() => setActiveFilter('السعودية')}
        >
          السعودية
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map(station => (
          <div
            key={station.id}
            className="card bg-base-200 cursor-pointer hover:shadow-lg"
            onClick={() => handleStationClick(station)}
          >
            <div className="card-body">
              <h3 className="card-title">
                <img
                  src={station.logo}
                  alt={station.name}
                  className="w-8 h-8 mr-2"
                />
                {station.name}
              </h3>
              <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={handlePlayPause}>
                  {currentStation?.id === station.id && isPlaying ? (
                    <Pause />
                  ) : (
                    <Play />
                  )}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => handleFavorite(station)}
                >
                  <Heart
                    className={
                      favorites.includes(station.id) ? 'text-red-500' : ''
                    }
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentStation && (
        <div className="fixed bottom-0 left-0 right-0 bg-base-300 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <h4 className="font-bold">{currentStation.name}</h4>
            </div>
            <audio
              ref={audioRef}
              src={currentStation.url}
              autoPlay={isPlaying}
              controls
              className="w-1/2"
            />
            <div className="flex items-center">
              <button className="btn btn-outline" onClick={handleMute}>
                {isMuted ? <VolumeX /> : <Volume2 />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="mx-2"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuranRadio;
