import type { Movie, MovieResponse } from '../types/movie';
import { useEffect, useState } from 'react';
import axios from 'axios';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  console.log(movies); // 영화 데이터 체크

  useEffect(() => {
    const fetchMovies = async () => {
        const { data } = await axios.get<MovieResponse>(
            'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
            {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYzVjY2QxZjMyMDVlZmFjODkyYzVlNTgxNWY1MjY4OSIsIm5iZiI6MTc3NDk5Njk3OS43MTEsInN1YiI6IjY5Y2M0ZGYzYTI1M2YwYzcyNGVkNDdlOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.APchjMzIRObS5T04QcUSNIveb8Kq3D0QGhwvpeJM0y0`,
                }
            }
        );
        setMovies(data.results);
    };

    fetchMovies();
  }, []);

  return (
    <div className="bg-black min-h-screen p-8">
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies?.map((movie) => (
            <li 
            key={movie.id} 
            className="relative group overflow-hidden rounded-lg cursor-pointer bg-gray-900"
            >
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:blur-sm"
            />
            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h2 className="text-white text-center font-bold text-lg mb-2">
                {movie.title}
                </h2>
                <p className="text-white text-xs text-center line-clamp-3">
                {movie.overview || "줄거리 정보가 없습니다."}
                </p>
            </div>
            </li>
        ))}
        </ul>
    </div>
  );
};

export default MoviesPage;