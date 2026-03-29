import {THEME, useTheme } from './ThemeProvider';
import clsx from 'clsx';

export default function ThemeToggleButton() {
    const { theme, toggleTheme } = useTheme();
    const isLightMode = theme === THEME.LIGHT; //isLightMode는 theme이 "LIGHT"인지 여부를 나타내는 boolean 값, theme이 "LIGHT"이면 isLightMode는 true, 그렇지 않으면 false가 됨
    return (
        <button 
         onClick={toggleTheme}
         className={clsx('px-4 py-2 rounded-md transition-all',{
            'bg-black text-white': !isLightMode,
            'bg-white text-black': isLightMode,  //isLightMode가 true면 흰색 배경과 검은색 텍스트, false면 검은색 배경과 흰색 텍스트로 설정
         })}
        >
        {isLightMode? "다크모드": "라이트모드"}
    </button>
  ) //버튼의 텍스트는 isLightMode가 true면 "다크모드", false면 "라이트모드"로 설정
}