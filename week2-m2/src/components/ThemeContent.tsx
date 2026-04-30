import { clsx } from 'clsx';
import { useTheme } from '../context/ThemeContext';

const ThemeContent = () => {
  const { theme } = useTheme();
  const isLightMode = theme === 'light';

  return (
    <main className={clsx("flex-1 w-full p-4", isLightMode ? "bg-white" : "bg-gray-800")}>
      <h1 className={clsx("text-2xl font-bold", isLightMode ? "text-black" : "text-white")}>
        다크 모드 실습하는 중이에요! Dori는 세상최고
      </h1>
      <p className={clsx("mt-4", isLightMode ? "text-black" : "text-white")}>
        가나다라마바사아자차카타파하
      </p>
    </main>
  );
};

export default ThemeContent;