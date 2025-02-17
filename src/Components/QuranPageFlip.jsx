import React, { useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

const QuranPageFlip = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch('/data/pagesQuran.json')
      .then(response => response.json())
      .then(data => {
        // Sort pages in reverse order for right-to-left reading
        const sortedPages = [...data].sort((a, b) => b.page - a.page);
        setPages(sortedPages);
      });
  }, []);

  // Calculate aspect ratio based on standard Quran page dimensions
  const pageWidth = 500; // Further reduced width
  const pageHeight = Math.round(pageWidth * 1.4); // Maintain aspect ratio

  return (
    <div className='flex justify-center p-4 quran-book-container' dir='rtl'>
      <HTMLFlipBook
        width={pageWidth}
        height={pageHeight}
        size='stretch' // Use stretch size for responsive design
        minWidth={250}
        maxWidth={500}
        minHeight={350}
        maxHeight={700}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        useMouseEvents={true}
        flippingTime={1000}
        className='shadow-2xl quran-book'
        style={{ direction: 'rtl' }}
        startPage={pages.length - 1} // Start from the last page for RTL
        renderOnlyPageLengthChange={true}
      >
        {pages.map((page, index) => (
          <div
            key={page.page}
            className='quran-page bg-[#f7f8f9] relative'
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px'
            }}
          >
            <img
              src={page.image.url}
              alt={`صفحة ${page.page}`}
              className='w-full h-full object-contain'
              style={{
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            />
            <div className='absolute bottom-4 w-full text-center text-gray-600'>
              <span className='px-2 py-1 rounded-lg bg-white/80'>
                {page.page}
              </span>
            </div>
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default QuranPageFlip;
