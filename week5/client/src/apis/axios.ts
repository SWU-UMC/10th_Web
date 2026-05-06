import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/v1',
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

  
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        
        const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          refresh: refreshToken, 
        });

        if (res.data.status) {
          
          alert("토큰이 만료되어 자동으로 재발급되었습니다! "); 
          console.log("재발급 성공:", res.data.data.accessToken);

          const { accessToken, refreshToken: newRefreshToken } = res.data.data;
          
         
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
      
        if (!originalRequest._retrySent) { 
          originalRequest._retrySent = true;
          alert("로그인 시간이 만료되어 다시 로그인이 필요합니다. ");
          localStorage.clear();
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;