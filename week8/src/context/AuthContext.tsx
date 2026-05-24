import React, { createContext, useContext, useState } from 'react';
import { postSignUp } from '../api/auth'; 
import { useLocalStorage } from '../hooks/useLocalStorage';
// 질문자님의 실제 폴더 구조에 있던 storage.ts 파일에서 키값을 가져옵니다.
// 만약 storage.ts 내부에 선언된 이름이 다르면 'LOCAL_STORAGE_KEYS' 부분을 실제 변수명으로 고쳐주세요!
import { LOCAL_STORAGE_KEYS } from '../constants/keys'; 

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  loginState: (accessToken: string, refreshToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // 1. 훅을 호출할 때는 인자를 넣지 않습니다. (Expected 0 arguments 에러 해결)
  const { getItem, setItem, removeItem } = useLocalStorage();

  // 2. 값을 꺼내올 때는 정의하신 대로 인자에 키(Key)를 넘겨줍니다.
  const [accessToken, setAccessToken] = useState<string | null>(() => 
    getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(() => 
    getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
  );

  // 회원가입 함수
  const signup = async (signUpData: any) => {
    try {
      await postSignUp(signUpData);
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
    } catch (error) {
      console.error(error);
      alert('회원가입 실패');
      throw error;
    }
  };

  // 로그인 성공 시 토큰을 저장하는 함수 (Expected 1 arguments 에러 해결)
  const loginState = (newAccess: string, newRefresh: string) => {
    // 값을 저장할 때 (키, 값) 형태로 2개의 인자를 정확히 넘겨줍니다.
    setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, newAccess);
    setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, newRefresh);
    
    setAccessToken(newAccess);
    setRefreshToken(newRefresh);
  };

  // 로그아웃 함수
  const logout = () => {
    // 삭제할 때도 키를 인자로 넘겨줍니다.
    removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    
    setAccessToken(null);
    setRefreshToken(null);
    alert('로그아웃 되었습니다.');
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, signup, logout, loginState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
};