import React from 'react';

interface Movie {
  id: number;
  title: string;
  original_title?: string;
  poster_path: string | null;
  backdrop_path?: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movie, onClose }) => {
  if (!movie) return null;

  
  const getImageUrl = (path: string | null | undefined) => 
    path ? `https://image.tmdb.org/t/p/w500${path}` : 'https://via.placeholder.com/500x750?text=No+Image';

  // IMDb 검색 처리 함수
  const handleIMDbSearch = () => {
    const searchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    // 모달 오버레이 
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      
      {/* 모달 박스 */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl animate-fade-in">
        
        {/* 상단 포스터 이미지 배경*/}
        <div className="relative h-60 w-full bg-gray-900">
          <img 
            src={getImageUrl(movie.backdrop_path || movie.poster_path)}
            alt={movie.title} 
            className="h-full w-full object-cover brightness-50"
          />
          {/* 우측 상단 X 닫기 버튼 */}
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:text-gray-300 transition-colors text-2xl"
          >
            ✕
          </button>
          {/* 상단 이미지 위 제목 표시 */}
          <div className="absolute bottom-4 left-6 text-white">
            <h2 className="text-2xl font-bold">{movie.title}</h2>
            {movie.original_title && (
              <p className="text-sm text-gray-300 mt-1">{movie.original_title}</p>
            )}
          </div>
        </div>

        {/* 상세 정보 영역 */}
        <div className="flex flex-col md:flex-row p-6 gap-6 max-h-[60vh] overflow-y-auto">
          {/* 좌측 포스터 카드 */}
        
          <div className="w-full md:w-1/3 shrink-0">
            <img 
              src={getImageUrl(movie.poster_path)} 
              alt={movie.title} 
              className="w-full rounded-lg shadow-md object-cover"
            />
          </div>

          {/* 우측 텍스트 정보 */}
          <div className="w-full md:w-2/3 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-semibold text-lg">★ {movie.vote_average.toFixed(1)}</span>
                <span className="text-xs text-gray-400">(평점)</span>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-gray-500">개봉일</h4>
                <p className="text-gray-800">{movie.release_date}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-500">줄거리</h4>
                <p className="text-gray-600 text-sm leading-relaxed mt-1 whitespace-pre-line">
                  {movie.overview || "줄거리 정보가 없습니다."}
                </p>
              </div>
            </div>

            {/* 하단 버튼 바 */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button 
                onClick={handleIMDbSearch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                IMDb에서 검색
              </button>
              <button 
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default React.memo(MovieDetailModal);