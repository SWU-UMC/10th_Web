import  clsx  from 'clsx';
import { useTheme, THEME } from '../context/ThemeContext'; 

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  const isLightMode = theme === THEME.LIGHT; 

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "px-4 py-2 rounded-md transition-colors",
        isLightMode ? "bg-black text-white" : "bg-white text-black"
      )}
    >
      {isLightMode ? '다크 모드' : '라이트 모드'}
    </button>
  );
};

export default ThemeToggleButton;