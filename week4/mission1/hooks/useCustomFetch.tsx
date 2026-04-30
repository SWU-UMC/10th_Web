import { useEffect, useState } from "react";
import axios from "axios";

export default function useCustomFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    axios(url, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
      },
    })
      .then((res) => setData(res.data))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, [url]);

  return { data, isLoading, isError };
}