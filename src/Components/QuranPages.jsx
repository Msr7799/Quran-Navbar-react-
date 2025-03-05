import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Search,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

const QuranPages = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(604);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [pagesData, setPagesData] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [isPageBookmarked, setIsPageBookmarked] = useState(false);
  const [showPageInfo, setShowPageInfo] = useState(false);
  const [currentPageInfo, setCurrentPageInfo] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const pageContainerRef = useRef(null);

  // استخراج رقم الصفحة من الـ query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get('page');
    if (pageParam && !isNaN(parseInt(pageParam))) {
      setCurrentPage(parseInt(pageParam));
    }
  }, [location]);

  // قراءة بيانات الصفحات من الملف JSON
  useEffect(() => {
    fetch('/data/pagesQuran.json')
      .then(response => response.json())
      .then(data => {
        setPagesData(data);
        setTotalPages(data.length);
      })
      .catch(error => console.error('Error loading pages data:', error));
  }, []);

  // جلب بيانات الصفحة الحالية
  useEffect(() => {
    if (pagesData.length > 0) {
      const pageData = pagesData.find(p => p.page === currentPage);
      if (pageData) {
        setCurrentPageInfo(pageData);
      }
    }
  }, [currentPage, pagesData]);

  // استرجاع العلامات المرجعية المحفوظة
  useEffect(() => {
    const storedBookmarks = JSON.parse(
      localStorage.getItem('quranBookmarks') || '[]'
    );
    setBookmarks(storedBookmarks);
    setIsPageBookmarked(
      storedBookmarks.some(b => b.pageNumber === currentPage)
    );
  }, [currentPage]);

  // تحديث رابط الموقع عند تغيير الصفحة
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set('page', currentPage);
    navigate(`?${params.toString()}`, { replace: true });
  }, [currentPage, navigate, location.search]);

  // التعامل مع الصفحة السابقة والتالية باستخدام لوحة المفاتيح
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'ArrowRight') {
        goToPreviousPage();
      } else if (e.key === 'ArrowLeft') {
        goToNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  // الانتقال للصفحة السابقة
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setLoading(true);
    }
  };

  // الانتقال للصفحة التالية
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setLoading(true);
    }
  };

  // تكبير الصفحة
  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 2));
  };

  // تصغير الصفحة
  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  // إضافة أو إزالة علامة مرجعية
  const toggleBookmark = () => {
    const timestamp = new Date().toISOString();
    const updatedBookmarks = [...bookmarks];

    if (isPageBookmarked) {
      // إزالة العلامة المرجعية
      const filteredBookmarks = updatedBookmarks.filter(
        b => b.pageNumber !== currentPage
      );
      setBookmarks(filteredBookmarks);
      localStorage.setItem('quranBookmarks', JSON.stringify(filteredBookmarks));
      setIsPageBookmarked(false);
    } else {
      // إضافة علامة مرجعية جديدة
      const newBookmark = {
        pageNumber: currentPage,
        timestamp,
        note: ''
      };
      updatedBookmarks.push(newBookmark);
      setBookmarks(updatedBookmarks);
      localStorage.setItem('quranBookmarks', JSON.stringify(updatedBookmarks));
      setIsPageBookmarked(true);
    }
  };

  // تنسيق رقم الجزء والحزب والربع
  const formatPartInfo = pageInfo => {
    if (!pageInfo || !pageInfo.start || !pageInfo.end) return null;

    // هنا يمكن إضافة منطق لاستخراج معلومات الجزء والحزب والربع من بيانات الصفحة
    // سنضع بيانات افتراضية للعرض التوضيحي

    const partNumber = Math.ceil(currentPage / 20); // افتراضي
    const hizbNumber = Math.ceil(currentPage / 8); // افتراضي

    return {
      part: partNumber,
      hizb: hizbNumber % 4 || 4,
      quarter: (hizbNumber % 4 || 4) * 4 - Math.floor(Math.random() * 4)
    };
  };

  // معلومات الصفحة
  const pageInfo = formatPartInfo(currentPageInfo);

  return (
    <div className="relative min-h-screen bg-base-200">
      {/* شريط التنقل العلوي */}
      <div className="sticky top-16 z-20 py-2 bg-base-100 shadow-md flex justify-between items-center px-4">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {/* رقم الصفحة الحالية والتنقل */}
          <div className="flex items-center bg-base-200 rounded-lg">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 disabled:opacity-50"
              aria-label="الصفحة السابقة"
            >
              <ChevronRight size={20} />
            </button>

            <span className="px-3 font-bold">{currentPage}</span>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-2 disabled:opacity-50"
              aria-label="الصفحة التالية"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* البحث السريع */}
          <button
            className="p-2 hover:bg-base-200 rounded-full"
            aria-label="بحث"
            onClick={() => navigate('/search')}
          >
            <Search size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {/* زر العلامات المرجعية */}
          <button
            className={`p-2 hover:bg-base-200 rounded-full ${
              isPageBookmarked ? 'text-primary' : ''
            }`}
            aria-label={
              isPageBookmarked ? 'إزالة العلامة المرجعية' : 'إضافة علامة مرجعية'
            }
            onClick={toggleBookmark}
          >
            {isPageBookmarked ? (
              <BookmarkCheck size={20} />
            ) : (
              <Bookmark size={20} />
            )}
          </button>

          {/* أزرار التكبير والتصغير */}
          <button
            className="p-2 hover:bg-base-200 rounded-full"
            aria-label="تكبير"
            onClick={zoomIn}
          >
            <Plus size={20} />
          </button>
          <button
            className="p-2 hover:bg-base-200 rounded-full"
            aria-label="تصغير"
            onClick={zoomOut}
          >
            <Minus size={20} />
          </button>

          {/* الذهاب إلى صفحة محددة */}
          <div className="relative">
            <label htmlFor="pageNumber" className="sr-only">
              الانتقال إلى صفحة
            </label>
            <input
              id="pageNumber"
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={e => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page);
                }
              }}
              className="input input-sm input-bordered w-20"
            />
          </div>
        </div>
      </div>

      {/* عرض معلومات الصفحة */}
      {showPageInfo && currentPageInfo && (
        <div className="absolute top-20 right-4 z-10 bg-base-100 shadow-lg p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">معلومات الصفحة</h3>
          {pageInfo && (
            <div className="space-y-2 text-sm">
              <p>الجزء: {pageInfo.part}</p>
              <p>الحزب: {pageInfo.hizb}</p>
              <p>الربع: {pageInfo.quarter}</p>
              {currentPageInfo.start && (
                <>
                  <p>
                    السورة:{' '}
                    {currentPageInfo.start.name?.ar ||
                      `سورة رقم ${currentPageInfo.start.surah_number}`}
                  </p>
                  <p>
                    من الآية: {currentPageInfo.start.verse} إلى الآية:{' '}
                    {currentPageInfo.end.verse}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* صفحة المصحف */}
      <div className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <div
              ref={pageContainerRef}
              className="relative overflow-hidden rounded-lg shadow-lg"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center top',
                transition: 'transform 0.3s ease'
              }}
              onClick={() => setShowPageInfo(!showPageInfo)}
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-base-200 bg-opacity-75 z-10">
                  <div className="loading loading-spinner loading-lg text-primary"></div>
                </div>
              )}
              <img
                src={`/data/quran_image/${currentPage}.png`}
                alt={`صفحة ${currentPage} من المصحف الشريف`}
                className="max-w-full h-auto"
                onLoad={() => setLoading(false)}
                style={{ minHeight: '500px', objectFit: 'contain' }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* شريط التنقل السفلي للشاشات الصغيرة */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-base-100 shadow-lg py-2 px-4 flex justify-around items-center z-30">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="p-2 disabled:opacity-50"
        >
          <ChevronRight size={24} />
        </button>

        <span className="font-bold">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="p-2 disabled:opacity-50"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
    </div>
  );
};

export default QuranPages;
