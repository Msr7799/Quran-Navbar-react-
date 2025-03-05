import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  BookOpen,
  Clock,
  X,
  Filter,
  Search,
  Trash2,
  Play
} from 'lucide-react';
import { useTheme } from '../ThemeContext';

const BookmarksPage = () => {
  const { state, dispatch } = useTheme();
  const [activeTab, setActiveTab] = useState('bookmarks'); // 'bookmarks' or 'history'
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const navigate = useNavigate();

  // إعداد العناصر المعروضة بناءً على التبويب الحالي والبحث
  useEffect(() => {
    const items = activeTab === 'bookmarks' ? state.bookmarks : state.history;

    if (!items || items.length === 0) {
      setShowEmptyState(true);
      setFilteredItems([]);
      return;
    }

    setShowEmptyState(false);

    if (searchTerm.trim() === '') {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item => {
      if (item.title) {
        return (
          item.title.includes(searchTerm) ||
          (item.subtitle && item.subtitle.includes(searchTerm))
        );
      }
      return false;
    });

    setFilteredItems(filtered);
  }, [activeTab, state.bookmarks, state.history, searchTerm]);

  // إضافة إشارة مرجعية
  const handleAddBookmark = item => {
    if (!item) return;

    const newBookmark = {
      id: `bookmark-${Date.now()}`,
      type: item.type || 'ayah',
      surahId: item.surahId || 1,
      ayahNumber: item.ayahNumber || 1,
      page: item.page || 1,
      title: item.title || '',
      subtitle: item.subtitle || '',
      timestamp: new Date().toISOString()
    };

    dispatch({ type: 'ADD_BOOKMARK', payload: newBookmark });
  };

  // حذف إشارة مرجعية
  const handleDeleteItem = id => {
    if (activeTab === 'bookmarks') {
      dispatch({ type: 'REMOVE_BOOKMARK', payload: id });
    } else {
      // يمكن إضافة وظيفة حذف العنصر من السجل إذا رغبت
      console.log('حذف من السجل غير مدعوم حالياً');
    }
    setIsDeleteModalOpen(false);
  };

  // فتح مربع حوار الحذف
  const openDeleteModal = item => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // التنقل إلى الصفحة المقابلة للإشارة المرجعية
  const navigateToItem = item => {
    if (!item) return;

    if (item.type === 'ayah' || item.type === 'verse') {
      navigate(`/reader/${item.surahId}?ayah=${item.ayahNumber}`);
    } else if (item.type === 'page') {
      navigate(`/reader?page=${item.page}`);
    } else if (item.type === 'surah') {
      navigate(`/reader/${item.surahId}`);
    }
  };

  // تكوينات الحركة للمكونات
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const tabVariants = {
    inactive: { color: 'var(--tw-text-opacity-70)' },
    active: {
      color: 'var(--primary)',
      borderBottom: '2px solid var(--primary)',
      transition: { duration: 0.2 }
    }
  };

  // تصيير حالة فارغة
  const renderEmptyState = () => (
    <motion.div
      className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {activeTab === 'bookmarks' ? (
        <>
          <Bookmark size={64} className="text-base-content/20 mb-4" />
          <h3 className="text-xl font-semibold mb-2">لا توجد إشارات مرجعية</h3>
          <p className="text-base-content/60 text-center max-w-md mb-6">
            يمكنك إضافة إشارات مرجعية أثناء قراءة القرآن الكريم للرجوع إليها
            لاحقاً
          </p>
          <Link to="/reader/1" className="btn btn-primary">
            <BookOpen size={18} className="ml-2" />
            ابدأ القراءة الآن
          </Link>
        </>
      ) : (
        <>
          <Clock size={64} className="text-base-content/20 mb-4" />
          <h3 className="text-xl font-semibold mb-2">لا يوجد سجل للقراءة</h3>
          <p className="text-base-content/60 text-center max-w-md mb-6">
            سيظهر هنا سجل قراءتك للقرآن الكريم
          </p>
          <Link to="/reader/1" className="btn btn-primary">
            <BookOpen size={18} className="ml-2" />
            ابدأ القراءة الآن
          </Link>
        </>
      )}
    </motion.div>
  );

  // تصيير عنصر في القائمة
  const renderItem = (item, index) => (
    <motion.div
      key={item.id || index}
      variants={itemVariants}
      className="bg-base-200 rounded-lg p-4 hover:bg-primary/5 transition-all"
      whileHover={{ scale: 1.01, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
      layoutId={`item-${item.id}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3 space-x-reverse">
          <div className="bg-primary/10 rounded-lg p-2 ml-3">
            {activeTab === 'bookmarks' ? (
              <Bookmark size={20} className="text-primary" />
            ) : (
              <Clock size={20} className="text-primary" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-sm text-base-content/70">{item.subtitle}</p>

            <div className="flex flex-wrap gap-2 mt-2">
              {item.type === 'ayah' && (
                <span className="badge badge-sm">{`الآية: ${item.ayahNumber}`}</span>
              )}
              {item.surahId && (
                <span className="badge badge-sm badge-primary badge-outline">{`السورة: ${item.surahId}`}</span>
              )}
              {item.page && (
                <span className="badge badge-sm badge-secondary badge-outline">{`الصفحة: ${item.page}`}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            className="btn btn-sm btn-outline btn-error"
            onClick={() => openDeleteModal(item)}
          >
            <Trash2 size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline btn-primary"
            onClick={() => navigateToItem(item)}
          >
            <Play size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">الإشارات المرجعية</h1>
        <div className="flex items-center space-x-4 space-x-reverse">
          <button
            className="btn btn-outline btn-primary"
            onClick={() => setActiveTab('bookmarks')}
            variants={tabVariants}
            animate={activeTab === 'bookmarks' ? 'active' : 'inactive'}
          >
            <Bookmark size={20} className="mr-2" />
            الإشارات المرجعية
          </button>
          <button
            className="btn btn-outline btn-primary"
            onClick={() => setActiveTab('history')}
            variants={tabVariants}
            animate={activeTab === 'history' ? 'active' : 'inactive'}
          >
            <Clock size={20} className="mr-2" />
            السجل
          </button>
        </div>
      </div>
      <div className="flex items-center mb-4">
        <div className="relative w-full">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="ابحث عن إشارة مرجعية أو سجل..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search
            size={20}
            className="absolute right-3 top-3 text-base-content/50"
          />
        </div>
      </div>
      {showEmptyState ? (
        renderEmptyState()
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => renderItem(item, index))}
          </AnimatePresence>
        </motion.div>
      )}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">تأكيد الحذف</h3>
            <p className="text-base-content/70 mb-6">
              هل أنت متأكد أنك تريد حذف هذه الإشارة المرجعية؟
            </p>
            <div className="flex justify-end space-x-2 space-x-reverse">
              <button
                className="btn btn-outline btn-error"
                onClick={() => handleDeleteItem(itemToDelete.id)}
              >
                نعم، احذف
              </button>
              <button
                className="btn btn-outline btn-secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BookmarksPage;
