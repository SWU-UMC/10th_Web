import { useState, useEffect } from 'react';
import axios from 'axios';

const useCustomFetch = <T>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsPending(true);
            setIsError(false);

            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` 
                    }
                });
                setData(response.data);
            } catch (error) {
                setIsError(true);
                console.error("데이터 가져오기 실패:", error);
            } finally {
                setIsPending(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, isPending, isError };
};

export default useCustomFetch;
