import { clsx } from 'clsx';
import { useTheme } from '../context/ThemeContext';
import ThemeToggleButton from './ThemeToggleButton';

const NavBar = () => {
  const { theme } = useTheme();
  const isLightMode = theme === 'light';

  return (
    <div className={clsx("w-full p-4 flex justify-end", isLightMode ? "bg-white" : "bg-gray-800")}>
      <ThemeToggleButton />
    </div>
  );
};

export default NavBar;