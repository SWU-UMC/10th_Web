import { createContext, type PropsWithChildren, useContext, useState} from "react";

export const THEME = {
    LIGHT: 'LIGHT',
    DARK: 'DARK',
} as const;

export type Theme = typeof THEME[keyof typeof THEME];

interface IThemeContext {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);
export const ThemeProvider = ({children}: PropsWithChildren) => {
    const [theme, setTheme] = useState<Theme>(THEME.LIGHT);

    const toggleTheme = () => {
        setTheme((prevTheme) => 
            (prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
    }


    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme는 반드시 ThemeProvider 내부에서 사용되어야 합니다.');
    }

    return context;
}