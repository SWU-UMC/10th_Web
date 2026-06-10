import type { Movie, MovieResponse } from '../types/movie';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TopRatedPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1); 
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const [isError, setIsError] = useState(false);

  console.log(movies); // 영화 데이터 체크

  useEffect(() => {
    const fetchMovies = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const { data } = await axios.get<MovieResponse>(
            `https://api.themoviedb.org/3/movie/top_rated?language=KR&page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
                }
            }
        );
        setMovies(data.results);
        } catch (error) {
            console.error("데이터 로딩 실패", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
        window.scrollTo(0, 0);
    };

    fetchMovies();
  }, [page]);   // 페이지가 바뀔 때마다 실행

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        {/* 로딩 스피너 애니메이션 */}
        <div className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 mt-4 font-medium">로딩 중입니다...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-2xl font-bold mb-4">에러가 발생했습니다 😢</h1>
        <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
            다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen p-8">
        {/* 페이지네이션 */}
        <div className="flex justify-center items-center gap-4 mb-10">
            <button 
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="w-12 h-10 flex items-center justify-center rounded-lg bg-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 transition"
            >
                &lt;
            </button>
            <span className="text-lg font-semibold">{page} 페이지</span>
            <button 
                onClick={() => setPage((prev) => prev + 1)}
                className="w-12 h-10 flex items-center justify-center rounded-lg bg-purple-200 text-purple-600 font-bold hover:bg-purple-300 transition"
            >
                &gt;
            </button>
        </div>

        {/* 영화 */}
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies?.map((movie) => (
            <li key={movie.id}>
              <Link to={`/movies/${movie.id}`} className="block">
                <div className="relative group overflow-hidden rounded-xl cursor-pointer bg-gray-900 shadow-md">
                  <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:blur-sm"
                  />

                  <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h2 className="text-white text-center font-bold text-lg mb-2">
                        {movie.title}
                      </h2>
                      <p className="text-white text-[11px] text-center line-clamp-4">
                        {movie.overview || "줄거리 정보가 없습니다."}
                      </p>
                  </div>
                </div>
              </Link>
            </li>
        ))}
        </ul>
    </div>
  );
};

export default TopRatedPage;