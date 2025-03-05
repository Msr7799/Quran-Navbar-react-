import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="bg-base-200 rounded-full p-8 inline-block mb-6">
          <AlertCircle size={60} className="text-primary" />
        </div>

        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-5xl font-bold mb-4"
        >
          404
        </motion.h1>

        <h2 className="text-2xl font-bold mb-6">الصفحة غير موجودة</h2>
        <p className="text-base-content/70 mb-8 max-w-md mx-auto">
          الصفحة التي تبحث عنها قد تكون محذوفة أو تم تغيير عنوانها، أو قد تكون
          غير متاحة مؤقتًا.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link to="/" className="btn btn-primary">
            <Home size={18} className="ml-2" />
            العودة للرئيسية
          </Link>

          <Link to="/search" className="btn btn-outline">
            <Search size={18} className="ml-2" />
            البحث في الموقع
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center"
      >
        <blockquote className="text-xl italic">
          "وَمَا أَصَابَكَ مِنْ سَيِّئَةٍ فَمِن نَّفْسِكَ"
        </blockquote>
        <p className="text-base-content/60 mt-1">سورة النساء - الآية 79</p>
      </motion.div>
    </div>
  );
};

export default NotFound;
