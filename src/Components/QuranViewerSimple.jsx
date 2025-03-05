import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../utils/api';
import QuranPlayer from './QuranPlayer';
import { FaArrowLeft, FaArrowRight, FaBookmark, FaRegBookmark, FaSearch } from 'react-icons/fa';

/**
 * مكون عرض القرآن البسيط
 * يعرض صفحات القرآن مع إمكانية التنقل والاستماع والبحث
 */
const QuranViewerSimple = () => {
  // الحصول على معلمات العنوان
  const { pageNumber, surahId } = useParams();
  const navigate = useNavigate();
  
  // حالة المكون
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || 1);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(604); // عدد صفحات القرآن الكريم
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [activeAyah, setActiveAyah] = useState(null);

  // تحميل قائمة العلامات المرجعية من التخزين المحلي
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('quranBookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  // جلب بيانات الصفحة عند التغيير
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        setError(null);

        // تحديد الصفحة المراد جلبها
        let pageToFetch = currentPage;

        // إذا تم تحديد سورة في العنوان، احصل على الصفحة الأولى للسورة
        if (surahId && !pageNumber) {
          const surahs = await API.getSurahs();
          const selectedSurah = surahs.suwar.find(s => s.id === parseInt(surahId));
          if (selectedSurah && selectedSurah.pages && selectedSurah.pages.length > 0) {
            pageToFetch = selectedSurah.pages[0];
            setCurrentPage(pageToFetch);
          }
        }

        // جلب بيانات الصفحة
        const data = await API.getPage(pageToFetch);
        if (data) {
          setPageData(data);
        } else {
          throw new Error('بيانات الصفحة غير متوفرة');
        }
      } catch (err) {
        console.error('Error fetching page data:', err);
        setError('فشل في تحميل بيانات الصفحة. يرجى المحاولة لاحقاً.');
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [currentPage, surahId, pageNumber]);

  // التنقل بين الصفحات
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      navigate(`/quran/page/${nextPage}`);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      navigate(`/quran/page/${prevPage}`);
    }
  };

  // البحث في القرآن
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // تحويل البحث إلى رقم صفحة إذا كان رقمًا صالحًا
      const pageNum = parseInt(searchQuery, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        setCurrentPage(pageNum);
        navigate(`/quran/page/${pageNum}`);
        return;
      }

      // يمكن إضافة منطق البحث المتقدم هنا
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // إضافة/إزالة إشارة مرجعية
  const toggleBookmark = () => {
    const isBookmarked = bookmarks.includes(currentPage);
    let newBookmarks;
    
    if (isBookmarked) {
      newBookmarks = bookmarks.filter(p => p !== currentPage);
    } else {
      newBookmarks = [...bookmarks, currentPage].sort((a, b) => a - b);
    }
    
    setBookmarks(newBookmarks);
    localStorage.setItem('quranBookmarks', JSON.stringify(newBookmarks));
  };

  // معالج تشغيل الآية
  const handlePlayingAyah = useCallback((ayahData) => {
    setActiveAyah(ayahData);
  }, []);

  // تصيير حالة التحميل
  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // تصيير حالة الخطأ
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // لم يتم العثور على بيانات
  if (!pageData) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-warning">
          <span>لم يتم العثور على بيانات للصفحة المطلوبة</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 rtl">
      {/* شريط التحكم */}
      <div className="bg-base-200 p-4 rounded-lg shadow-md mb-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* التنقل بين الصفحات */}
          <div className="flex items-center gap-2">
            <button 
              className="btn btn-circle" 
              onClick={goToPrevPage} 
              disabled={currentPage <= 1}
              title="الصفحة السابقة"
            >
              <FaArrowRight />
            </button>
            
            <span className="mx-2 font-bold">
              الصفحة {currentPage} من {totalPages}
            </span>
            
            <button 
              className="btn btn-circle" 
              onClick={goToNextPage} 
              disabled={currentPage >= totalPages}
              title="الصفحة التالية"
            >
              <FaArrowLeft />
            </button>
          </div>
          
          {/* البحث */}
          <div className="form-control">
            <form onSubmit={handleSearch} className="input-group">
              <input 
                type="text" 
                placeholder="رقم الصفحة أو نص للبحث..." 
                className="input input-bordered w-full md:w-auto" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn">
                <FaSearch />
              </button>
            </form>
          </div>
          
          {/* الإشارات المرجعية */}
          <div>
            <button 
              className="btn btn-outline" 
              onClick={toggleBookmark}
              title={bookmarks.includes(currentPage) ? "إزالة الإشارة المرجعية" : "إضافة إشارة مرجعية"}
            >
              {bookmarks.includes(currentPage) ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>
        </div>
        
        {/* عرض الإشارات المرجعية */}
        {bookmarks.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm mb-2">الإشارات المرجعية:</h3>
            <div className="flex flex-wrap gap-2">
              {bookmarks.map(page => (
                <button 
                  key={page}
                  className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => {
                    setCurrentPage(page);
                    navigate(`/quran/page/${page}`);
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* عرض صفحة القرآن */}
      <div className="quran-page mb-8">
        <div className="bg-base-100 p-6 rounded-lg shadow-lg">
          {/* معلومات الصفحة */}
          <div className="mb-6 text-center">
            {pageData.start && (
              <div className="text-sm">
                <span>الصفحة تبدأ بـ: سورة {pageData.start.name?.ar || pageData.start.name_arabic} - الآية {pageData.start.verse}</span>
              </div>
            )}
            {pageData.end && (
              <div className="text-sm mt-1">
                <span>وتنتهي بـ: سورة {pageData.end.name?.ar || pageData.end.name_arabic} - الآية {pageData.end.verse}</span>
              </div>
            )}
          </div>
          
          {/* صورة الصفحة */}
          <div className="flex justify-center">
            {pageData.image && (
              <img
                src={pageData.image.url}
                alt={`صفحة ${currentPage} من القرآن الكريم`}
                className="max-w-full h-auto rounded-lg shadow"
              />
            )}
          </div>
        </div>
      </div>
      
      {/* مشغل القرآن */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">استمع للتلاوة</h2>
        <QuranPlayer
          pageNumber={currentPage}
          surahId={pageData.start?.surah_number}
          onPlayingAyah={handlePlayingAyah}
        />
      </div>
    </div>
  );
};

export default QuranViewerSimple;
