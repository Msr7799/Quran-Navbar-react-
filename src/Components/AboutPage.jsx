import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Github,
  Twitter,
  Mail,
  Linkedin,
  Globe,
  Code,
  Heart,
  Star,
  Book,
  Users,
  AlignRight,
  BookOpen,
  Calendar,
  FileText,
  ExternalLink,
  Home,
  Search,
  Settings,
  User,
  MessageCircle,
  Bug,
  Lightbulb,
  Wrench,
  Plus,
  Smartphone,
  Volume2
} from 'lucide-react';

// إضافة شعارات التقنيات مع استخدام نمط استيراد صحيح
import reactLogo from '../assets/tech-logos/react.svg';
import tailwindLogo from '../assets/tech-logos/tailwind.svg';
import daisyuiLogo from '../assets/tech-logos/daisyui.svg';
import framerMotionLogo from '../assets/tech-logos/framer-motion.svg';
import reactRouterLogo from '../assets/tech-logos/react-router.svg';
import lucideLogo from '../assets/tech-logos/lucide.svg';

const AboutPage = () => {
  // تعريف متغيرات التأثيرات الحركية
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const techCardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
      transition: { type: 'spring', stiffness: 300, damping: 10 }
    }
  };

  // العام الحالي للحقوق
  const currentYear = new Date().getFullYear();

  // معلومات التقنيات مع الشعارات
  const technologies = [
    {
      name: 'React.js',
      description: 'مكتبة JavaScript لبناء واجهات المستخدم',
      logo: reactLogo,
      category: 'واجهة المستخدم'
    },
    {
      name: 'Tailwind CSS',
      description: 'إطار عمل CSS للتصميم السريع',
      logo: tailwindLogo,
      category: 'التصميم'
    },
    {
      name: 'DaisyUI',
      description: 'مكونات UI جميلة لـ Tailwind CSS',
      logo: daisyuiLogo,
      category: 'مكتبات UI'
    },
    {
      name: 'Framer Motion',
      description: 'مكتبة لإنشاء الرسوم المتحركة',
      logo: framerMotionLogo,
      category: 'الحركة والتأثيرات'
    },
    {
      name: 'React Router',
      description: 'التنقل في تطبيقات React',
      logo: reactRouterLogo,
      category: 'التنقل'
    },
    {
      name: 'Lucide Icons',
      description: 'مجموعة أيقونات جميلة وسهلة الاستخدام',
      logo: lucideLogo,
      category: 'الأيقونات'
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      {/* رأس الصفحة مع العنوان */}
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          عن تطبيق القرآن الكريم
        </h1>
        <div className="h-1 w-64 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
        <p className="text-lg opacity-80">
          تطبيق إسلامي لتلاوة وتفسير وحفظ القرآن الكريم بواجهة عربية حديثة
        </p>
      </motion.div>

      {/* زر الانتقال إلى صفحة "عني" */}
      <motion.div
        variants={itemVariants}
        className="flex justify-center mb-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to="/about-me"
          className="btn btn-primary px-6 gap-2 shadow-lg hover:shadow-primary/20"
        >
          <FileText size={18} />
          نبذة عن المطور
          <ExternalLink size={16} />
        </Link>
      </motion.div>

      {/* قسم نبذة عن المشروع */}
      <motion.section variants={itemVariants} className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
          <Book /> نبذة عن المشروع
        </h2>
        <div className="bg-base-200/60 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-base-300/50">
          <p className="mb-6 leading-relaxed text-lg">
            هذا التطبيق هو منصة إسلامية تهدف إلى تسهيل قراءة وتلاوة وتفسير وحفظ
            القرآن الكريم من خلال واجهة عربية حديثة وسهلة الاستخدام. يوفر
            التطبيق العديد من الميزات المتقدمة مثل:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                icon: <Book size={18} />,
                text: 'تلاوة القرآن الكريم مع مختلف القراءات'
              },
              {
                icon: <BookOpen size={18} />,
                text: 'عرض تفاسير متعددة للآيات القرآنية'
              },
              {
                icon: <Search size={18} />,
                text: 'إمكانية البحث في نص القرآن والتفاسير'
              },
              { icon: <Star size={18} />, text: 'خاصية الحفظ ومتابعة التقدم' },
              {
                icon: <Settings size={18} />,
                text: 'تحديد واجهة المستخدم حسب التفضيل'
              },
              {
                icon: <Smartphone size={18} />,
                text: 'دعم مختلف الأجهزة والشاشات'
              }
            ].map((item, index) => (
              <motion.li
                key={index}
                className="flex items-center gap-2 bg-base-100/50 p-3 rounded-lg border border-base-300/30"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-primary">{item.icon}</div>
                <span>{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* بيانات المطور */}
      <motion.section variants={itemVariants} className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
          <Users /> فريق التطوير
        </h2>

        <div className="bg-base-200/60 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-base-300/50">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              className="aspect-square w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-4xl text-primary font-bold shadow-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 10,
                delay: 0.2
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: '0px 0px 30px rgba(var(--primary-color), 0.5)'
              }}
            >
              م ر
            </motion.div>
            <div className="text-center md:text-right space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                محمد الرميحي
              </h3>
              <p className="text-lg opacity-80 py-1 px-3 bg-primary/10 inline-block rounded-full">
                مهندس برمجيات
              </p>
              <p className="leading-relaxed">
                مطور برمجيات متخصص في تطوير تطبيقات الويب باستخدام React وإنشاء
                واجهات المستخدم التفاعلية. أعمل على تطوير هذا التطبيق بهدف تقديم
                تجربة فريدة لمستخدمي القرآن الكريم وتسهيل الوصول لمختلف المصادر
                الإسلامية بتقنيات حديثة.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <motion.a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm gap-2 hover:bg-base-300/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github size={16} />
                  GitHub
                </motion.a>
                <motion.a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm gap-2 hover:bg-base-300/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin size={16} />
                  LinkedIn
                </motion.a>
                <motion.a
                  href="mailto:alromaihi2224@gmail.com"
                  className="btn btn-outline btn-sm gap-2 hover:bg-base-300/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail size={16} />
                  البريد الإلكتروني
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* التقنيات المستخدمة */}
      <motion.section variants={itemVariants} className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-primary">
          <Code /> التقنيات المستخدمة
        </h2>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              className="bg-base-100 border border-base-300/30 rounded-xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={techCardVariants}
              whileHover="hover"
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <img
                  src={tech.logo}
                  alt={tech.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="badge badge-primary mb-2">{tech.category}</div>
              <h3 className="font-bold text-lg mb-2">{tech.name}</h3>
              <p className="text-sm opacity-70">{tech.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* الخدمات والواجهات البرمجية */}
      <motion.section variants={itemVariants} className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
          <Globe /> الخدمات والواجهات البرمجية
        </h2>
        <div className="bg-base-200/60 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-base-300/50">
          <p className="mb-6 text-lg">
            يستخدم التطبيق عدة واجهات برمجية للحصول على البيانات القرآنية:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'Quran.com API',
                description: 'لنص القرآن والتفاسير',
                icon: <BookOpen className="text-primary" size={24} />
              },
              {
                name: 'MP3Quran.net',
                description: 'للتلاوات الصوتية',
                icon: <Volume2 className="text-primary" size={24} />
              },
              {
                name: 'Alquran.cloud',
                description: 'للبحث والترجمات',
                icon: <Search className="text-primary" size={24} />
              }
            ].map((api, index) => (
              <motion.div
                key={api.name}
                className="bg-base-100/50 p-5 rounded-lg border border-base-300/30 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="mb-3 bg-primary/10 p-3 rounded-full">
                  {api.icon}
                </div>
                <h3 className="font-bold mb-2">{api.name}</h3>
                <p className="text-sm opacity-70">{api.description}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-center italic opacity-80">
            نشكر القائمين على هذه الواجهات البرمجية لإتاحة هذه البيانات القيمة
            للمطورين.
          </p>
        </div>
      </motion.section>

      {/* المساهمة ورخصة المشروع */}
      <motion.section variants={itemVariants} className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
          <BookOpen /> المساهمة والرخصة
        </h2>
        <div className="bg-base-200/60 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-base-300/50">
          <p className="mb-6 text-lg">
            هذا المشروع مفتوح المصدر ونرحب بمساهمات المطورين. يمكنك المساهمة من
            خلال:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { icon: <Bug size={16} />, text: 'الإبلاغ عن المشكلات والأخطاء' },
              {
                icon: <Lightbulb size={16} />,
                text: 'اقتراح ميزات وتحسينات جديدة'
              },
              {
                icon: <Wrench size={16} />,
                text: 'إصلاح الأخطاء وتحسين الكود'
              },
              { icon: <Plus size={16} />, text: 'إضافة ميزات جديدة' }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 bg-base-100/50 p-3 rounded-lg border border-base-300/30"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                <div className="text-primary">{item.icon}</div>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="flex items-center justify-between mt-8 bg-primary/10 p-3 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <p>آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>
            </div>
            <div className="badge badge-primary">v1.0.0</div>
          </motion.div>
        </div>
      </motion.section>

      {/* روابط التنقل السريع */}
      <motion.section variants={itemVariants} className="text-center">
        <h2 className="text-2xl font-bold mb-8 flex items-center justify-center gap-2 text-primary">
          <AlignRight /> روابط سريعة
        </h2>
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          variants={containerVariants}
        >
          {[
            { path: '/', text: 'الصفحة الرئيسية', icon: <Home size={16} /> },
            {
              path: '/quran/reader',
              text: 'قراءة القرآن',
              icon: <BookOpen size={16} />
            },
            {
              path: '/quran/search',
              text: 'البحث في القرآن',
              icon: <Search size={16} />
            },
            { path: '/about-me', text: 'عن المطور', icon: <User size={16} /> },
            {
              path: '/contact',
              text: 'تواصل معنا',
              icon: <MessageCircle size={16} />
            }
          ].map((link, i) => (
            <motion.div
              key={link.path}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={link.path}
                className="btn btn-outline gap-2 hover:bg-primary hover:text-primary-content hover:border-primary"
              >
                {link.icon}
                {link.text}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="mt-16 text-base-content/70 flex items-center justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Heart size={16} className="text-red-500" />
          تم تطويره بكل حب وإخلاص {currentYear}
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default AboutPage;
