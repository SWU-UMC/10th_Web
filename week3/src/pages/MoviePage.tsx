import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Movie, MovieResponse } from '../types/movie';

export default function MoviePage() {
  const { category } = useParams<{ category: string }>();
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isPending, setIsPending] = useState(false); 
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsPending(true);
      setIsError(false);
      try {
        const response = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        setMovies(response.data.results);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    if (category) {
      fetchMovies();
    }
  }, [category, page]); // 카테고리나 페이지 번호가 바뀌면 다시 데이터 패칭!

  // 다른 카테고리를 누르면 무조건 1페이지로 리셋
  useEffect(() => {
    setPage(1);
  }, [category]);

  if (isError) {
    return (
      <div className="text-red-500 font-bold text-2xl text-center mt-10">
        에러가 발생했습니다 
      </div>
    );
  }

  return (
    <div className="flex flex-col">
    
      <div className="flex items-center justify-center gap-6 my-6">
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className="w-12 h-10 flex justify-center items-center bg-gray-200 text-gray-500 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
        >
          {'<'}
        </button>
        <span className="font-bold text-gray-800">{page} 페이지</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="w-12 h-10 flex justify-center items-center bg-[#d695df] text-white font-bold rounded-lg hover:bg-[#c07bc9] transition hover:cursor-pointer"
        >
          {'>'}
        </button>
      </div>

      
      {isPending ? (
        <div className="h-[50vh] flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-10">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}