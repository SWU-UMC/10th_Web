import { useState, useCallback, useMemo } from 'react';
import { useFetch } from '../hooks/useFetch';
import { MovieResponse, MovieFilters, Movie } from '../types/movie'; 
import { MovieFilter } from '../components/MovieFilter';
import { MovieGrid } from '../components/MovieGrid';
import MovieDetailModal from '../components/MovieDetailModal';

export default function Home() {
  // 초기 검색 필터 기본값 설정
  const [filters, setFilters] = useState<MovieFilters>({
    query: '코난', 
    include_adult: false,
    language: 'ko-KR'
  });

  
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // 1. useCallback으로 함수 참조 고정 
  const handleFilterChange = useCallback((nextFilters: MovieFilters) => {
    setFilters(nextFilters);
  }, []);

  const handleOpenModal = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  // 2. useMemo로 객체 참조 고정 
  const requestOptions = useMemo(() => {
    return {
      params: {
        query: filters.query,
        include_adult: filters.include_adult,
        language: filters.language
      }
    };
  }, [filters]); 

  // 커스텀 훅으로 데이터 호출
  const { data, isReadOnly, error } = useFetch<MovieResponse>('/search/movie', requestOptions);

  const movies = data?.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 검색 및 필터 영역 */}
      <MovieFilter onFilterChange={handleFilterChange} />

      {/* 데이터 상태별 렌더링 */}
      {isReadOnly && (
        <div className="flex justify-center items-center h-40">
          <p className="text-xl font-semibold text-blue-500 animate-pulse">Loading...</p>
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center h-40">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      )}

  
      {!isReadOnly && !error && (
        <MovieGrid movies={movies} onMovieClick={handleOpenModal} />
      )}

      
      <MovieDetailModal movie={selectedMovie} onClose={handleCloseModal} />
    </div>
  );
}