import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import type { RequestSigninDto } from "../types/auth";
import {createContext} from "react";
import type { PropsWithChildren } from "react";
import { postLogout, postSignin } from "../apis/auth";
import { useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
    accessToken: string | null; 
    refreshToken: string | null;
    userInfo: any | null;
    login:(signinData: RequestSigninDto) => Promise<void>;
    logout:() => Promise<void>;
}
export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    userInfo: null,
    login: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({children}:PropsWithChildren) => {
   const{getItem:getAccessTokenFromStorage, setItem: setAccessTokenStorage, removeItem:removeAccessTokenFromStorage}
   =useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken,
   )
   const{getItem:getRefreshTokenFromStorage, setItem: setRefreshTokenStorage, removeItem:removeRefreshTokenFromStorage}=useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken,
   )
   const [accessToken, setAccessToken]=useState<string|null>(
   getAccessTokenFromStorage()
   );
   const [refreshToken, setRefreshToken]=useState<string|null>(
    getRefreshTokenFromStorage()
   );
   const [userInfo, setUserInfo] = useState<any | null>(null);

   // 앱 초기 로드 시 토큰이 있으면 사용자 정보 디코딩
   useEffect(() => {
    const token = getAccessTokenFromStorage();
    if (token) {
      try {
        const decoded = jwtDecode(token) as any;
        setUserInfo(decoded);
      } catch (error) {
        console.error('토큰 디코딩 실패:', error);
      }
    }
   }, []);
   const login=async(signinData:RequestSigninDto)=>{
    try{
        const {data}=await postSignin(signinData);

        if(data){
            const newAccessToken=data.accessToken;
            const newRefreshToken=data.refreshToken;

            setAccessTokenStorage(newAccessToken);
            setRefreshTokenStorage(newRefreshToken);

            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);
            
            // 토큰에서 사용자 정보 디코딩
            try {
              const decoded = jwtDecode(newAccessToken) as any;
              setUserInfo(decoded);
            } catch (error) {
              console.error('토큰 디코딩 실패:', error);
            }
            
            alert("로그인 성공");
            window.location.href = "/protected";
        }
    } catch (error) {
    console.error("로그인 오류", error);
    alert("로그인 실패");
}
   }
   const logout=async()=>{
    try{
        await postLogout();
        removeAccessTokenFromStorage();
        removeRefreshTokenFromStorage();
        setAccessToken(null);
        setRefreshToken(null);
        setUserInfo(null);

        alert("로그아웃 성공")
    }catch(error){
        console.error("로그아웃 오류", error);
        alert("로그아웃 실패")
    }
   };
   return(
    <AuthContext.Provider value={{accessToken, refreshToken, userInfo, login, logout}}>
        {children}
    </AuthContext.Provider>
   );
};
export const useAuth=()=>{
    const context=useContext(AuthContext);
    if(!context){
        throw new Error("AuthContext를 찾을 수 없습니다");
    }
    return context;
}


