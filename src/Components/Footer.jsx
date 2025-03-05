import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Github,
  Heart,
  Book,
  Twitter,
  Facebook,
  Instagram,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../ThemeContext';

const Footer = () => {
  const { state } = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: 'الرئيسية', path: '/' },
    { title: 'فهرس السور', path: '/index' },
    { title: 'القارئ', path: '/reader/1' },
    { title: 'المفضلة', path: '/bookmarks' },
    { title: 'الإعدادات', path: '/settings' },
    { title: 'عن التطبيق', path: '/about' }
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: <Github size={18} />,
      url: 'https://github.com/username/quran-app'
    },
    {
      name: 'Twitter',
      icon: <Twitter size={18} />,
      url: 'https://twitter.com/'
    },
    {
      name: 'Facebook',
      icon: <Facebook size={18} />,
      url: 'https://facebook.com/'
    },
    {
      name: 'Instagram',
      icon: <Instagram size={18} />,
      url: 'https://instagram.com/'
    }
  ];

  const resourceLinks = [
    { name: 'المصحف الإلكتروني', url: 'https://quran.com/ar' },
    { name: 'تفسير القرآن', url: 'https://tafsir.app/' },
    { name: 'مشروع المصحف', url: 'https://tanzil.net//' },
    { name: 'تعلم القراءة', url: 'https://quranreading.com/' }
  ];

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const socialVariants = {
    hidden: { scale: 0 },
    visible: i => ({
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 15
      }
    })
  };

  return (
    <motion.footer
      className="bg-base-200 pt-10 pb-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* القسم الأول */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center">
              <Book size={20} className="ml-2" />
              تطبيق القرآن الكريم
            </h3>
            <p className="text-base-content/70 text-sm">
              تطبيق مفتوح المصدر للقراءة والاستماع للقرآن الكريم بواجهة سهلة
              وبسيطة
            </p>
            <div className="flex space-x-2 space-x-reverse">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-circle btn-sm btn-ghost hover:bg-primary/20"
                  custom={index}
                  variants={socialVariants}
                  whileHover={{
                    scale: 1.15,
                    transition: { type: 'spring', stiffness: 300 }
                  }}
                  title={link.name}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* القسم الثاني */}
          <div>
            <h3 className="text-lg font-bold mb-4">روابط التطبيق</h3>
            <div className="grid grid-cols-2 gap-2">
              {footerLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-base-content/70 hover:text-primary hover:underline text-sm py-1"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          {/* القسم الثالث */}
          <div>
            <h3 className="text-lg font-bold mb-4">مصادر مفيدة</h3>
            <div className="space-y-2">
              {resourceLinks.map(link => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-content/70 hover:text-primary hover:underline text-sm flex items-center"
                >
                  {link.name}
                  <ExternalLink size={12} className="mr-1" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-base-300 pt-4 mt-4 text-center">
          <p className="text-sm text-base-content/60 flex flex-wrap justify-center items-center gap-1">
            <span>جميع الحقوق محفوظة</span>
            <motion.span
              className="inline-flex items-center text-primary"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              <Heart size={14} fill="currentColor" className="mx-1" />
            </motion.span>
            <span>{currentYear} ©</span>
          </p>
          <p className="text-xs text-base-content/50 mt-1">
            محتوى القرآن الكريم مقدم من{' '}
            <a
              href="https://quran.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              Quran.com API
            </a>
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
