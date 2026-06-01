import { useState, useEffect } from 'react';
import { axiosClient } from '../api/axiosClient';
import { AxiosRequestConfig } from 'axios';

export function useFetch<T>(url: string, options?: AxiosRequestConfig) {
  const [data, setData] = useState<T | null>(null);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false); // 로딩 상태
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsReadOnly(true);
      try {
        const response = await axiosClient.get(url, options);
        setData(response.data);
      } catch (err) {
        setError('데이터를 가져오는데 에러가 발생했습니다.');
      } finally {
        setIsReadOnly(false);
      }
    };

    fetchData();
  }, [url, options]); // ⚠️ 여기서 options(객체)가 바뀌면 계속 호출되므로, 외부에서 useMemo 처리가 필수야!

  return { data, isReadOnly, error };
}