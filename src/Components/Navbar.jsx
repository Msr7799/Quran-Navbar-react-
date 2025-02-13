import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';

const Navbar = () => {
  const { state, dispatch } = useTheme();
  const { theme, isDarkMode } = state;
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (newTheme) => {
    dispatch({ type: 'SET_THEME', payload: newTheme });
    setIsOpen(false); // Close the dropdown after selection
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  return (
    <nav className='flex justify-between items-center p-4  text-white '> 
      <a href='https://github.com/msr7799' className='flex items-center space-x-2'>
      <img src='https://cdn-icons-png.flaticon.com/512/25/25231.png' alt='logo' className='w-10 h-10' />
     </a>
      <div className='relative'>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'
        >
          {theme}
          <svg
            className='-mr-1 ml-2 h-5 w-5'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              fillRule='evenodd'
              d='M5.23 7.21a.75.75 0 011.06 0L10 10.44l3.71-3.23a.75.75 0 111.06 1.06l-4.25 3.5a.75.75 0 01-1.06 0l-4.25-3.5a.75.75 0 010-1.06z'
              clipRule='evenodd'
            />
          </svg>
        </button>
        {isOpen && (
          <div className='absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div
              className='py-1'
              role='menu'
              aria-orientation='vertical'
              aria-labelledby='options-menu'
            >
              {[
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
                'winter',
                'dim',
                'nord',
                'sunset',
              ].map((theme) => (
                <button
                  key={theme}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                    state.theme === theme ? 'font-bold' : ''
                  }`}
                  onClick={() => handleThemeChange(theme)}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <button
        onClick={toggleTheme}
        className='ml-4 p-2 rounded bg-gray-600 hover:bg-gray-500'
        aria-label='Toggle theme'
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </nav>
  );
};

export default Navbar;