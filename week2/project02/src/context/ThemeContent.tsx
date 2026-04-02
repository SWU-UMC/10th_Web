
import { THEME, useTheme } from './ThemeProvider';
import clsx from 'clsx';

export default function ThemeContent() {
  const{theme,toggleTheme}=useTheme(); //useTheme을 사용해서 ThemeContext의 값을 가져옴, useTheme은 ThemeContext의 값을 반환하기 때문에 구조분해할당을 통해 theme과 toggleTheme을 가져옴
  const isLightMode=theme===THEME.LIGHT;
  return (
    <div className={clsx('p-4 h-dvh w-full', isLightMode?'bg-white':'bg-gray-800')}> </div> 
  )
}



