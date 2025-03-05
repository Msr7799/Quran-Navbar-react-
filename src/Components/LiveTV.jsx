import React, { useState, useEffect } from 'react';
import { API } from '../utils/api';

const LiveTV = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [language, setLanguage] = useState('ar');

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const data = await API.getLiveTV(language);

        // Updated to use 'livetv' property instead of 'tvs'
        const channelsData = data.livetv || [];
        setChannels(channelsData);

        if (channelsData.length > 0) {
          setSelectedChannel(channelsData[0]);
        }
      } catch (err) {
        console.error('Error fetching live TV channels:', err);
        setError('حدث خطأ أثناء تحميل القنوات. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [language]);

  const handleChannelChange = e => {
    const channelId = e.target.value;
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      setSelectedChannel(channel);
    }
  };

  return (
    <div className='container mx-auto py-8 px-4'>
      <h1 className='text-3xl font-bold text-center mb-8'>القنوات المباشرة</h1>

      <div className='flex flex-wrap gap-4 mb-6 justify-center'>
        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>اختر اللغة</span>
          </label>
          <select
            className='select select-bordered w-full max-w-xs'
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option value='ar'>العربية</option>
            <option value='eng'>English</option>
          </select>
        </div>

        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>اختر القناة</span>
          </label>
          <select
            className='select select-bordered w-full max-w-xs'
            value={selectedChannel?.id || ''}
            onChange={handleChannelChange}
            disabled={loading || channels.length === 0}
          >
            {channels.map(channel => (
              <option key={channel.id} value={channel.id}>
                {channel.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className='flex justify-center'>
          <div className='loader'></div>
        </div>
      ) : error ? (
        <div className='alert alert-error'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='stroke-current shrink-0 h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span>{error}</span>
        </div>
      ) : (
        <div className='flex flex-col items-center'>
          {selectedChannel ? (
            <div className='w-full max-w-4xl'>
              <div className='card bg-base-100 shadow-xl'>
                <div className='card-body'>
                  <h2 className='card-title'>{selectedChannel.name}</h2>
                  <div className='aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden'>
                    <iframe
                      src={selectedChannel.url}
                      title={selectedChannel.name}
                      allowFullScreen
                      className='w-full h-full'
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='alert alert-info'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                className='stroke-current shrink-0 w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                ></path>
              </svg>
              <span>الرجاء اختيار قناة للمشاهدة</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveTV;
