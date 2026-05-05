import {useLocalStorage}from "../hooks/useLocalStorage"
import {useEffect}from "react";
import {LOCAL_STROAGE_KEY}from "../src/constants/key";

const GoogleLoginRedirectPage=()=>{
    const {setItem:setAccessToken}=useLocalStorage(LOCAL_STROAGE_KEY.ACCESS_TOKEN);
    const {setItem:setRefreshToken}=useLocalStorage(LOCAL_STROAGE_KEY.REFRESH_TOKEN);
    useEffect(()=>{
        const urlParams=new URLSearchParams(window.location.search);
        const accessToken=urlParams.get("LOCAL_STORAGE_KEY.accessToken");
        const refreshToken=urlParams.get("LOCAL_STORAGE_KEY.refreshToken");

        if(accessToken){
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            window.location.href="/my";
        }
    }, [setAccessToken, setRefreshToken]);
    return(
        <div>구글 로그인 리다이렉션 화면</div>
    );
};
export default GoogleLoginRedirectPage;