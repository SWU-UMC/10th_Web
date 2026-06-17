import React, { useState, useCallback } from 'react';
import type { Movie } from '../types/movie';
import SearchForm from '../components/SearchForm';
import MovieCard from '../components/MovieCard';

const MainSearchPage = () => {
  const [query, setQuery] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState("ko-KR");
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) {
      alert("영화 제목을 입력해주세요!");
      return;
    }

    setIsLoading(true);

    try {
      const token = import.meta.env.VITE_TMDB_TOKEN; 

      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=${includeAdult}&language=${language}&page=1`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('API 호출에 실패했습니다. 토큰이나 네트워크 상태를 확인해주세요.');
      }

      const data = await response.json();
      setMovies(data.results);

    } catch (error) {
      console.error("영화 검색 오류:", error);
      alert("영화를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [query, includeAdult, language]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        
        <SearchForm 
          query={query} setQuery={setQuery}
          includeAdult={includeAdult} setIncludeAdult={setIncludeAdult}
          language={language} setLanguage={setLanguage}
          onSearch={handleSearch}
        />

        {isLoading && (
          <div className="text-center text-blue-600 font-bold my-8">
            영화를 검색하고 있습니다... 🎬
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
              />
            ))}
          </div>
        )}
        
        {!isLoading && movies.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            위 검색창에서 영화를 검색해보세요! (검색 결과가 없거나 아직 검색하지 않음)
          </p>
        )}
      </div>
    </div>
  );
};

export default MainSearchPage;