import { createContext, useContext } from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useState } from "react";
import { postSignin } from "../apis/auth";
import { postLogout } from "../apis/auth";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (signInData: RequestSigninDto) => Promise<boolean>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => false,
    logout: async () => {},
});

export const AuthProvider = ({children}) => {
    const {
        getItem: getAccessTokenFromStorage,
        setItem: setAccessTokenToStorage,
        removeItem: removeAccessTokenFromStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    const {
        getItem: getRefreshTokenFromStorage,
        setItem: setRefreshTokenToStorage,
        removeItem: removeRefreshTokenFromStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromStorage() as string | null);
    const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenFromStorage() as string | null);

    const login = async(signInData: RequestSigninDto) => {
        try {
            const {data} = await postSignin(signInData);

            if (data) {
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);

                setAccessTokenToStorage(newAccessToken);
                setRefreshTokenToStorage(newRefreshToken);
                alert("로그인 성공!");
                return true;
            }
        } catch (error) {
            console.error("로그인 오류", error);
            alert("로그인 실패. 다시 시도해주세요.");
        }

        return false;
    };

    const logout = async() => {
        try {
            await postLogout();
            
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();

            setAccessToken(null);
            setRefreshToken(null);
            alert("로그아웃 성공!");
        } catch(error) {
            console.error("로그아웃 오류", error);
            alert("로그아웃 실패. 다시 시도해주세요.");
        }
    }

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}