import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from './components/MovieCard';
import type { Movie, MovieResponse } from './types/movie';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get<MovieResponse>(
          'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        // results 안에 있는 영화 배열을 상태에 저장
        setMovies(response.data.results);
      } catch (error) {
        console.error('영화를 불러오는데 실패했습니다:', error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">도리의 영화 목록</h1>
      
      {/* 반응형 그리드: 화면 크기에 따라 2칸~6칸으로 자동 조절 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default App;