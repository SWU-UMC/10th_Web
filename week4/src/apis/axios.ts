import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean; // 요청 재시도 여부를 나타내는 플래그
}

let refreshPromise: Promise<string>| null = null;

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

//요청 인터셉터: 모든 요청 전에 accessToken을 Authorization 헤더에 추가
axiosInstance.interceptors.request.use(
    (config) => {
    const {getItem} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const accessToken = getItem();

    // accessToken이 존재하면 요청 헤더에 Authorization 추가
    if(accessToken){
        config.headers = config.headers ||{};
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    //수정된 요청 설정을 반환합니다.
    return config;
},

(error) => Promise.reject(error),
);

//응답 인터셉터: 401 Unauthorized 응답을 감지하여 토큰 갱신 시도
axiosInstance.interceptors.response.use(
    (response) => response, // 정상 응답은 그대로 반환
    async (error) => {
        const originalRequest:CustomInternalAxiosRequestConfig = error.config;

        if (
            error.response &&
            error.response.status === 401 && 
            !originalRequest._retry
        ){
            if(originalRequest.url === '/v1/auth/refresh') {
                const {removeItem: removeAccessToken} = useLocalStorage(
                    LOCAL_STORAGE_KEY.accessToken,
                );
                const {removeItem: removeRefreshToken} = useLocalStorage(
                    LOCAL_STORAGE_KEY.refreshToken,
                );
                removeAccessToken();
                removeRefreshToken();
                window.location.href = '/login';
                return Promise.reject(error);
            }
            // 재시도  플래그 설정
            originalRequest._retry = true;

            // 이미 리프레시 요청 진행중이면, Promise를 반환하여 대기
            if (!refreshPromise) {
                //refresh 요청 실행후, 프라미스르 ㄹ전역 변수에 할당.
                refreshPromise = (async() => {
                   const {getItem: getRefreshToken } = useLocalStorage(
                    LOCAL_STORAGE_KEY.refreshToken,
                    );
                   const refreshToken = getRefreshToken();

                   const {data} = await axiosInstance.post('/v1/auth/refresh', {
                    refresh:refreshToken,
                   });
                   //새 토큰이 반환
                   const {setItem: setAccessToken} = useLocalStorage(
                    LOCAL_STORAGE_KEY.accessToken,
                   );
                   const {setItem: setRefreshToken} = useLocalStorage(
                    LOCAL_STORAGE_KEY.refreshToken,
                   );
                   setAccessToken(data.accessToken);
                   setRefreshToken(data.refreshToken);
                    
                   return data.accessToken;

                })()
                .catch((_error) => {
                const {removeItem: removeAccessToken} = useLocalStorage(
                LOCAL_STORAGE_KEY.accessToken,
                );
                const {removeItem: removeRefreshToken} = useLocalStorage(
                LOCAL_STORAGE_KEY.refreshToken,
                );
                removeAccessToken();
                removeRefreshToken();
                })
                .finally(() => {
                    refreshPromise = null;
            });
        }
        //진행중인 refreshPromise가 해결될때까지 기다림.
        return refreshPromise.then((newAccessToken) => {
            //원본 요청의 Authorization 헤더를 새로운 액세스 토큰으로 업데이트
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            //업데이트 된 원본 요청을 재시도합니다. 
            return axiosInstance.request(originalRequest);                
        });
    }
    //401 에러가 아닌경우에 그대로 오류를 반환
    return Promise.reject(error);
},
);