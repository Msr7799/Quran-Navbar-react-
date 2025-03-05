import React from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  Github,
  Briefcase,
  User,
  Award,
  Languages,
  FileText,
  Download,
  ExternalLink,
  Code,
  Heart,
  Layers,
  CheckCircle,
  Shield,
  Star
} from 'lucide-react';

// استيراد صورة شخصية افتراضية من Lucide كحل مؤقت بدلاً من ملف الصورة
// يمكنك استبدال هذا لاحقًا بصورة حقيقية بعد إضافتها للمشروع
import { UserCircle } from 'lucide-react';

const AboutMePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  };

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', damping: 10 }
    },
    hover: {
      scale: 1.05,
      background: 'var(--primary-color-light)',
      transition: { type: 'spring', stiffness: 300, damping: 10 }
    }
  };

  // مهارات التطوير
  const devSkills = [
    'HTML, CSS, JavaScript',
    'React, Next.js',
    'Python',
    'تصميم واجهات UI/UX',
    'Git & GitHub',
    'تكامل API',
    'إدارة قواعد البيانات (SQL, NoSQL)',
    'مبادئ الأمن السيبراني'
  ];

  // مهارات شخصية
  const personalSkills = [
    'المرونة',
    'التواصل الفعال',
    'مهارات تنظيمية قوية',
    'سرعة التعلم',
    'العمل الجاد',
    'القيادة',
    'العمل الجماعي'
  ];

  return (
    <motion.div
      className="container mx-auto px-4 py-12 max-w-5xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={sectionVariants} className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mb-4">
          نبذة عني
        </h1>
        <div className="h-1 w-64 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-2"></div>
      </motion.div>

      <motion.section
        variants={sectionVariants}
        className="bg-base-200/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden mb-10 border border-base-300/50"
      >
        <div className="p-8 md:flex items-start gap-8">
          {/* استخدام أيقونة مستخدم بدلاً من الصورة */}
          <motion.div
            className="md:w-1/3 mb-6 md:mb-0 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring&apos;, damping: 10, delay: 0.2 }}
          >
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl bg-base-300 flex items-center justify-center">
              <UserCircle size={120} className="text-primary" />
            </div>
          </motion.div>

          {/* معلومات الملف الشخصي */}
          <div className="md:w-2/3 text-right">
            <motion.h2
              className="text-3xl font-bold mb-3 text-primary"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              محمد سعود الرميحي
            </motion.h2>

            <motion.div
              className="mb-4 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="badge badge-primary py-3 gap-1">
                <Briefcase size={14} /> مهندس برمجيات
              </div>
              <div className="badge badge-secondary py-3 gap-1">
                <Shield size={14} /> فني أمن سيبراني (CCT)
              </div>
              <div className="badge py-3 gap-1">
                <Star size={14} /> نقيب سابق
              </div>
            </motion.div>

            <motion.div className="space-y-3 mb-6" variants={sectionVariants}>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <span>البريد الإلكتروني: alromaihi2224@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <span>الهاتف: 37925259</span>
              </div>
              <div className="flex items-center gap-2">
                <Github size={16} className="text-primary flex-shrink-0" />
                <span>GitHub: msr7799</span>
              </div>
            </motion.div>

            <motion.div className="flex gap-4 mt-6" variants={sectionVariants}>
              <motion.a
                href="https://www.canva.com/design/DAGdXXESxG4/3xIoFIjEWaBfEGegdvKxnQ/view"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={16} />
                تحميل السيرة الذاتية
              </motion.a>

              <motion.a
                href="https://e-commerce-website-full-stack.onrender.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink size={16} />
                زيارة موقع المتجر الإلكتروني
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* قسم النبذة الشخصية */}
      <motion.section
        variants={sectionVariants}
        className="bg-base-200/60 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-10 border border-base-300/50"
      >
        <div className="flex items-center gap-2 mb-4">
          <User size={20} className="text-primary" />
          <h2 className="text-2xl font-bold">نبذة شخصية</h2>
        </div>

        <p className="leading-relaxed mb-4 text-right">
          قائد عسكري وفني أمن سيبراني (CCT) ومطور Full-Stack بخبرة في تأ
        </p>
      </motion.section>
    </motion.div>
  );
};

export default AboutMePage;
