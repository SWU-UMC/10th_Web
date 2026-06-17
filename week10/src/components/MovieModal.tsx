import type { Movie } from '../types/movie';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-md w-full relative flex flex-col max-h-[90vh]">
        
        <div className="h-72 w-full bg-gray-200 shrink-0">
          <img 
            src={movie.poster_path && movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 overflow-y-auto">
          <h2 className="text-2xl font-black text-gray-800 mb-2">{movie.title}</h2>
          
          <div className="flex gap-4 text-sm font-bold text-gray-600 mb-4">
            <span>⭐ 평점: {movie.vote_average.toFixed(1)}</span>
            <span>📅 개봉: {movie.release_date}</span>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6 text-sm">
            {movie.overview || "줄거리가 제공되지 않습니다."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => window.open(`https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`, '_blank')}
              className="flex-1 bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              IMDb에서 검색하기
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default MovieModal;