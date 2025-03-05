import React, { useState, useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { API } from '../utils/api';
import {
  FaBookmark,
  FaChevronLeft,
  FaChevronRight,
  FaSearch
} from 'react-icons/fa';

const QuranPageFlip = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchPage, setSearchPage] = useState('');
  const [zoom, setZoom] = useState(1);
  const bookRef = useRef(null);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const data = await API.getAllPages();
      setPages(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error loading pages:', err);
      setError('حدث خطأ في تحميل الصفحات. يرجى المحاولة مرة أخرى');
      setLoading(false);
    }
  };

  const goToPage = pageNum => {
    const pageNumber = parseInt(pageNum);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= 604) {
      setCurrentPage(pageNumber);
      if (bookRef.current) {
        // Some implementations based on react-pageflip
        // This may need adjustment based on the library behavior
        bookRef.current.pageFlip().turnToPage(pageNumber - 1);
      }
    }
  };

  const handleSearchPage = e => {
    e.preventDefault();
    goToPage(searchPage);
  };

  const bookmarkCurrentPage = () => {
    const bookmarks = JSON.parse(
      localStorage.getItem('quranBookmarks') || '[]'
    );
    const existingBookmark = bookmarks.findIndex(
      b => b.pageNumber === currentPage
    );

    if (existingBookmark === -1) {
      bookmarks.push({
        pageNumber: currentPage,
        timestamp: new Date().toISOString(),
        note: ''
      });
      localStorage.setItem('quranBookmarks', JSON.stringify(bookmarks));
      alert('تمت إضافة الصفحة للمفضلة');
    } else {
      alert('هذه الصفحة موجودة بالفعل في المفضلة');
    }
  };

  const nextPage = () => {
    if (currentPage < 604) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="flex items-center justify-between w-full mb-4">
        <div>
          <h1 className="text-2xl font-bold">مصحف القرآن الكريم</h1>
        </div>
        <div className="flex items-center space-x-2">
          <form onSubmit={handleSearchPage} className="flex items-center">
            <input
              type="number"
              value={searchPage}
              onChange={e => setSearchPage(e.target.value)}
              placeholder="رقم الصفحة"
              className="input input-bordered w-20 ml-2"
              min="1"
              max="604"
            />
            <button type="submit" className="btn btn-primary">
              <FaSearch />
            </button>
          </form>
          <button onClick={bookmarkCurrentPage} className="btn btn-ghost">
            <FaBookmark />
          </button>
          <div className="flex items-center space-x-2">
            <button onClick={zoomOut} className="btn btn-sm">
              -
            </button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={zoomIn} className="btn btn-sm">
              +
            </button>
          </div>
        </div>
      </div>

      <div
        className="relative w-full max-w-4xl border shadow-lg bg-white"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}
      >
        <img
          src={`/data/quran_image/${currentPage}.png`}
          alt={`صفحة ${currentPage}`}
          className="w-full object-contain"
        />
      </div>

      <div className="flex justify-between items-center w-full max-w-4xl mt-4">
        <button
          onClick={prevPage}
          className="btn btn-primary"
          disabled={currentPage === 1}
        >
          <FaChevronLeft /> الصفحة السابقة
        </button>
        <span className="text-lg font-bold">الصفحة {currentPage} من 604</span>
        <button
          onClick={nextPage}
          className="btn btn-primary"
          disabled={currentPage === 604}
        >
          الصفحة التالية <FaChevronRight />
        </button>
      </div>

      <div className="mt-8">
        {pages[currentPage - 1] && (
          <div className="bg-base-200 p-4 rounded-lg">
            <div className="text-center">
              <p className="font-bold">
                {pages[currentPage - 1].start?.surah_number &&
                  `السورة: ${pages[currentPage - 1].start.name?.ar || ''}`}
              </p>
              <p>
                {pages[currentPage - 1].start?.verse &&
                  `من الآية: ${pages[currentPage - 1].start.verse}`}
                {pages[currentPage - 1].end?.verse &&
                  ` إلى الآية: ${pages[currentPage - 1].end.verse}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuranPageFlip;
