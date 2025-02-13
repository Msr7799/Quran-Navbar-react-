import React, { createContext, useReducer, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const ThemeContext = createContext();

const themeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      Cookies.set('theme', action.payload);
      return { ...state, theme: action.payload };
    case 'TOGGLE_DARK_MODE':
      Cookies.set('isDarkMode', !state.isDarkMode);
      return { ...state, isDarkMode: !state.isDarkMode };
    default:
      return state;
  }
};

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, {
    theme: Cookies.get('theme') || 'forest',
    isDarkMode: Cookies.get('isDarkMode') === 'true',
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', state.isDarkMode);
  }, [state.isDarkMode]);
  useEffect(() => {
    Cookies.set('theme', state.theme);
  }
    , [state.theme]);
  useEffect(() => {
    Cookies.set('isDarkMode', state.isDarkMode);
  }
    , [state.isDarkMode]);
  

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);