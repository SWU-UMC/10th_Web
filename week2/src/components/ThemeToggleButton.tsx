import { clsx } from 'clsx';
import {THEME, useTheme} from '../context/ThemeProvider';

export default function ThemeToggleButton() {
    const {theme, toggleTheme} =useTheme();

    const isLightMode = theme === THEME.LIGHT;

    return (
        <button 
        onClick={toggleTheme}
        className={clsx('px-4 py-2 text-xs mt-4 ml-8 rounded-md transition-all', {
            'bg-black text-white': isLightMode,
            'bg-white text-black': !isLightMode
        })}
        >
            {isLightMode ? '🌙 ': '☀️ '}
        </button>
    )
}