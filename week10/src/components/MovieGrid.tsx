// MovieGrid.tsx 수정본
import { Movie } from '../types/movie';

interface MovieGridProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void; 
}

export function MovieGrid({ movies, onMovieClick }: MovieGridProps) { 
  if (movies.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="font-bold text-gray-500">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => {
        const posterUrl = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : 'https://via.placeholder.com/500x750?text=No+Image';

        return (
         
          <div 
            key={movie.id} 
            onClick={() => onMovieClick(movie)} 
            className="relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition group cursor-pointer"
          >
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs font-bold px-2 py-1 rounded">
              ⭐ {movie.vote_average.toFixed(1)}
            </div>
            <div className="p-4 bg-white border-t border-gray-100">
              <h3 className="font-bold text-gray-800 truncate">{movie.title}</h3>
              <p className="text-xs text-gray-500">{movie.release_date}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}