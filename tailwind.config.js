import forms from '@tailwindcss/forms';
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        quran: ['Amiri', 'Traditional Arabic', 'serif']
      },
      direction: {
        rtl: 'rtl',
        ltr: 'ltr'
      }
    }
  },
  // تفعيل داركمود
  darkMode: 'class',
  // إعدادات daisyui محسنة
  daisyui: {
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter'
    ],
    darkTheme: 'dark', // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    rtl: true, // ترتيب من اليمين إلى اليسار
    prefix: '', // prefix for daisyUI classnames (e.g. `btn`, `btn-primary`)
    logs: false // Shows info about daisyUI version and used config in console when building
  },
  plugins: [daisyui, forms]
};
