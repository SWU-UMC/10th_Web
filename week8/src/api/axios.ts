import axios from "axios";
import { LOCAL_STORAGE_KEYS } from "../constants/keys";

// 환경변수 기반 인스턴스 생성
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL || "http://localhost:8000/v1",
});

// 영상 48분 45초대 인터셉터 주입 코드 반영
axiosInstance.interceptors.request.use(
  (config) => {
    const tokenItem = window.localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (tokenItem) {
      // useLocalStorage 스트링기파이 대응 파싱 처리
      const token = JSON.parse(tokenItem);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);