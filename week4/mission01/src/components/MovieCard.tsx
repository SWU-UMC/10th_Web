import { Navigate, useParams } from 'react-router-dom';
import type { Movie } from '../types/movie';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const [isHovered, setIsHovered] = React.useState(false);
    const navigate = useNavigate();

  return (
    <div
    onClick={() => navigate(`/movies/detail/${movie.id}`)} 
    className='relative rounded-xl shadow-lg overflow-hidden cursor-pointer 
    w-44 transition-transform duration-300 transform hover:scale-105' 
    onMouseEnter={() : void => setIsHovered(true)}
    onMouseLeave={() : void => setIsHovered(false)}
    >
        <img 
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={`${movie.title} 영화의 이미지₩`}
        className=''
        />

        {isHovered && (
            <div className='absolute inset-0 bg-black/70 text-white p-4 flex flex-col justify-center p-4'>
                <h3 className='text-lg font-bold leading-snug'>{movie.title}</h3>
                <p className='text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5'>{movie.overview}</p>
            </div>
        )}
    </div>
  );
}