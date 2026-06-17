import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Movie } from '../types/movie';

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const token = import.meta.env.VITE_TMDB_TOKEN;
        
        // TMDB 영화 상세 정보 API 호출
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('상세 정보를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("영화 상세 정보 오류:", error);
        alert("상세 정보를 불러올 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl font-bold text-blue-600">영화 정보를 불러오는 중입니다... 🎬</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">영화를 찾을 수 없습니다.</h1>
        <button onClick={() => navigate(-1)} className="bg-gray-800 text-white px-4 py-2 rounded">
          뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* 포스터 영역 */}
        <div className="h-[500px] w-full bg-gray-200">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 상세 정보 영역 */}
        <div className="p-8">
          <h1 className="text-4xl font-black text-gray-800 mb-4">{movie.title}</h1>
          
          <div className="flex gap-4 text-sm font-bold text-gray-600 mb-6">
            <span>⭐ 평점: {movie.vote_average?.toFixed(1)}</span>
            <span>📅 개봉: {movie.release_date}</span>
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-8 text-lg">
            {movie.overview || "등록된 줄거리가 없습니다."}
          </p>
          
          {/* 하단 버튼 */}
          <div className="flex gap-4">
            <button
              onClick={() => window.open(`https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`, '_blank')}
              className="flex-1 bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              IMDb 검색
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MovieDetailPage;