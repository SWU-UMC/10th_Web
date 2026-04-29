import { createContext, useState, useContext, type PropsWithChildren } from 'react';


export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

type TTheme = typeof THEME[keyof typeof THEME];
interface IThemeContext {
  theme: TTheme;
  toggleTheme: () => void;
}


const ThemeContext = createContext<IThemeContext | null>(null);

export const ThemeProvider = ({ children }: PropsWithChildren) => {

  const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);
  const toggleTheme = () => {
    setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
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