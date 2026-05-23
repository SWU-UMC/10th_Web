import { useLocalStorage } from "../hooks/useLocalStorage";
import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?:boolean//요청 재시도 여부를 나타내는 프래그
}
//전역 변수로 refressh 요청의 Promise를 저장해서 중복 요청을 방지한다
let refreshPromise: Promise<string> | null = null;

export const axiosInstance=axios.create({
    baseURL:import.meta.env.VITE_SERVER_API_URL,
    
});
//요청 인터셉터: 모든 요청 전에 accessToken을 Authorization 헤더에 자동으로 추가한다
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
//응답 인터셉터: 401 에러 발생->refresh 토큰을 통한 토큰 갱신을 처리함
axiosInstance.interceptors.response.use(
    (response)=>response, //정상 응답 그대로 반환
    async(error)=>{
        const originalRequest:CustomInternalAxiosRequestConfig=error.config;
        //401에러이면서 아직 재시도 하지 않은 요청 경우 청이
        if(
            error.response&&
            error.response?.status===401 &&
            !originalRequest._retry

        ){
            //refresh 앤드 포인트 401 에러가 발생하는 경우, 중복 재시도 방지를 위해 로그아웃 철
            if (originalRequest.url?.includes("/v1/auth/refresh")) {
            localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
            localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
            window.location.href = "/login";
            return Promise.reject(error);
            }
            //재시도 플래그 설정
            originalRequest._retry=true;

            //이미 리프레시 요청이 진행중이라면 그 Promise를 재사용함
            if(!refreshPromise){
                //refresh 요청 실행 후 프라미스를 전역 변수에 할당
                refreshPromise=(async()=>{
                    const{getItem:getRefreshToken}=useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                    const refreshToken=getRefreshToken();
                    const { data } = await axiosInstance.post("/v1/auth/refresh",{ refreshToken: refreshToken });
                    //새 토큰이 반환
                    const{setItem:setAccessToken}=useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                    const{setItem:setRefreshToken}=useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                    setAccessToken(data.accessToken);
                    setRefreshToken(data.refreshToken);

                    //새 accessToken을 반환하여 다른 요청들이 이것을 사용할 수 있게함
                return data.accessToken;

                })().catch((_error)=>{
                    const{removeItem:removeAccessToken}=useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                    const{removeItem:removeRefreshToken}=useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                    removeAccessToken()
                    removeRefreshToken();
                })
                .finally(()=>{
                    refreshPromise=null;
                });
            }
            //진행 중인 refreshPromise가 해결될 때까지 기다림
            return refreshPromise.then((newAccessToken)=>{
                //원본 요청의 Authoirization 헤더를 갱신된 토큰으로 업뎃
                originalRequest.headers.Authorization=`Bearer ${newAccessToken}`;
                //업데이트 된 원본 요청을 재시도함
                return axiosInstance.request(originalRequest);
            });
            
        }
        //401에러가 아닌 경우에 그대로 오류 반환
        return Promise.reject(error);
    }
);

