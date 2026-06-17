import React, { useState } from 'react';
import type { Movie } from './types/movie';
import SearchForm from './components/SearchForm';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';

function App() {
  const [query, setQuery] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState("ko-KR");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) {
      alert("영화 제목을 입력해주세요!");
      return;
    }

    // TODO: 실제 API 호출 로직
    console.log(`📡 API 호출: 검색어=${query}, 성인포함=${includeAdult}, 언어=${language}`);
    
    // 테스트용 더미 데이터
    setMovies([
      {
        id: 1,
        title: query,
        poster_path: "https://image.tmdb.org/t/p/w500/8Z8dptJENM6XhP3R08E6O8nB3xS.jpg",
        vote_average: 8.8,
        release_date: "2010-07-15",
        overview: "분리된 컴포넌트에서도 모달 창이 완벽하게 뜹니다!"
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* 1. 검색 폼 컴포넌트 */}
        <SearchForm 
          query={query} setQuery={setQuery}
          includeAdult={includeAdult} setIncludeAdult={setIncludeAdult}
          language={language} setLanguage={setLanguage}
          onSearch={handleSearch}
        />

        {/* 2. 영화 목록 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onClick={setSelectedMovie} // 클릭 시 모달 띄우기
            />
          ))}
        </div>
        
        {movies.length === 0 && (
          <p className="text-center text-gray-500 mt-10">위 검색창에서 영화를 검색해보세요!</p>
        )}
      </div>

      {/* 3. 상세 정보 모달 컴포넌트 */}
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} // 닫기 버튼 누르면 null로 변경
        />
      )}
    </div>
  );
}

export default App;