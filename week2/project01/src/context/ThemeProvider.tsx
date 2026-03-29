import { createContext, useContext, useState, type PropsWithChildren } from "react";
export const THEME = {
  LIGHT: 'LIGHT',
  DARK: 'DARK',
} as const;

type TTheme = typeof THEME[keyof typeof THEME];
interface IThemeContext{    // 현재 상태의 타입 정의
    theme: TTheme;
    toggleTheme: ()=> void; //toggleTheme 이라는 이름의 함수 타입 정의, 테마를 변경함

}


export const ThemeContext=createContext<IThemeContext | undefined>(undefined);  //<>는 createContext의 상태가 없는거, 값이 없으니까 undefined로 들어옴
//하지만 이렇게 설정하면 any로 생각될 수 있기 때문에 undefined로 명시적으로 설정해주는 것이 좋음
//ThemeContext는 테마를 받을 수도 있고 테마를 변경하는 함수를 받을 수도 있기 때문에 IThemeContext 타입을 사용하여 createContext를 생성

export const ThemeProvider=({children}:PropsWithChildren)=>{  
    const [theme, setTheme]= useState<TTheme>(THEME.LIGHT); //상태 정의
    const toggleTheme=()=>{  //테마를 변경하는 함수 정의
        setTheme((prevTheme) => //이전 테마를 받아서
            prevTheme===THEME.LIGHT? THEME.DARK: THEME.LIGHT); //테마가 라이트면 다크로, 다크면 라이트로 변경으로 넘기겠다는 뜻
    };

    return(
        <ThemeContext.Provider value={{theme:theme, toggleTheme:toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
    
}; //provider이 우산 같은 역할이고, 이 우산을 전체적으로 씌워줌 , 우산 안에 들어간게 {children}이거임, {children}:PropsWithChildren 이거를 통해 children을 선언해줌
//ThemeContext.provider의 value는 interface 부분이 될 것임

export const useTheme=():IThemeContext=>{
    const context=useContext(ThemeContext); //useContext를 사용해서 ThemeContext의 값을 가져옴
    //ThemeContext에 연결된 Provider를 찾아서 그 value를 가져와라 그리고 그 값을 context로 한다라는 의미/ 그래서 다른 곳에서 useTheme을 사용하면 에러가 뜸
    if(!context){
        throw new Error("useTheme must be used within a ThemeProvider"); //만약 context가 undefined라면 에러를 던짐
        
    }
    return context;// 그대로 반환
}// useTheme라는 이름의 함수를 만들어서 ThemeContext의 값을 쉽게 사용할 수 있도록 하는 함수, 이 함수는 ThemeContext의 값을 반환할 것임