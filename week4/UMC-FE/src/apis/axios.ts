import axios, { AxiosError } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const baseURL = import.meta.env.VITE_SERVER_API_URL as string;

export const axiosInstance = axios.create({
    baseURL,
});

axiosInstance.defaults.headers.common["Authorization"] =
    `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)}`;

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token as string);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (err: AxiosError) => {
        const error = err as any;
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);

            if (!refreshToken) {
                localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                window.location.href = "/login";
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                });
            }

            isRefreshing = true;

            return new Promise((resolve, reject) => {
                axios
                    .post(
                        "/v1/auth/refresh",
                        { refreshToken },
                        { baseURL }
                    )
                    .then(({ data }) => {
                        const newAccessToken = data.accessToken;
                        const newRefreshToken = data.refreshToken;

                        localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, newAccessToken);
                        localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, newRefreshToken);

                        axiosInstance.defaults.headers.common["Authorization"] =
                            `Bearer ${newAccessToken}`;

                        processQueue(null, newAccessToken);

                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                        resolve(axiosInstance(originalRequest));
                    })
                    .catch((err) => {
                        processQueue(err, null);
                        localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                        localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                        window.location.href = "/login";
                        reject(err);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);