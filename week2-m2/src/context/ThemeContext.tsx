import { createContext, useState, useContext } from 'react';

// 1. 타입 정의
interface IThemeContext {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}


const ThemeContext = createContext<IThemeContext | undefined>(undefined);


export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme은 ThemeProvider 안에서 사용되어야 합니다.');
  }
  return context;
};