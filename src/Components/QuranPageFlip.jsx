import React, { useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

const QuranPageFlip = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch('/data/pagesQuran.json')
      .then(response => response.json())
      .then(data => setPages(data));
  }, []);

  return (
    <div className='flex justify-center p-4'>
      <HTMLFlipBook
        width={550}
        height={800}
        size='stretch'
        minWidth={400}
        maxWidth={800}
        minHeight={500}
        maxHeight={1000}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        useMouseEvents={true}
        flippingTime={1000} // زمن التقليب بالمللي ثانية
        className='shadow-2xl'
      >
        {pages.map(page => (
          <div key={page.page} className='w-page h-page bg-gray-50'>
            <img
              src={page.image.url}
              alt={`صفحة ${page.page}`}
              className='w-auto- h-auto mt-2 object-contain'
            />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default QuranPageFlip;