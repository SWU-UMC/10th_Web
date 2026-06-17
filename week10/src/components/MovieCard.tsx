import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = React.memo(({ movie }: MovieCardProps) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/movies/${movie.id}`)}
      className="bg-white rounded-lg shadow cursor-pointer hover:scale-105 transition-transform overflow-hidden"
    >
      <img 
        src={movie.poster_path && movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
        alt={movie.title} 
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg truncate">{movie.title}</h3>
        <p className="text-sm text-gray-500">⭐ {movie.vote_average}</p>
      </div>
    </div>
  );
});

export default MovieCard;