import { useState } from 'react';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 영화 포스터 이미지 */}
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-auto object-cover"
      />

      {/* 마우스 올렸을 때 나타나는 검은색 오버레이 */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center p-4 text-center text-white backdrop-blur-sm">
          <h2 className="text-lg font-bold mb-2">{movie.title}</h2>
          <p className="text-sm text-gray-300 line-clamp-5 leading-relaxed">
            {movie.overview || '상세 설명이 없습니다.'}
          </p>
        </div>
      )}
    </div>
  );
}