import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import type { MovieDetail, MovieCredits } from '../types/movie';

export default function MovieDetailPage() {
  
  const { movieId } = useParams<{ movieId: string }>();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<MovieCredits | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      setIsPending(true);
      setIsError(false);
      try {
        
        const [detailRes, creditsRes] = await Promise.all([
          axios.get<MovieDetail>(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, {
            headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
          }),
          axios.get<MovieCredits>(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, {
            headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
          }),
        ]);

        setMovie(detailRes.data);
        setCredits(creditsRes.data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    if (movieId) fetchMovieData();
  }, [movieId]);

  if (isPending) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !movie || !credits) {
    return <div className="text-white text-center mt-20 text-2xl font-bold">영화 정보를 불러올 수 없습니다 😢</div>;
  }

  
  const director = credits?.crew.find((c) => c.job === 'Director');

  return (
    <div className="relative min-h-screen text-white pb-20">
     
      <div 
        className="absolute top-0 left-0 w-full h-[70vh] bg-cover bg-center opacity-30 pointer-events-none"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      />
      <div className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

      
      <div className="relative z-10 container mx-auto px-6 pt-20 flex flex-col md:flex-row gap-10">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-64 md:w-80 rounded-2xl shadow-2xl"
        />
        
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">{movie.title}</h1>
          <p className="text-gray-300 text-lg mb-6 italic">{movie.original_title}</p>
          
          <div className="flex items-center gap-4 text-sm font-semibold mb-6">
            <span className="bg-[#bedab1] text-gray-900 px-3 py-1 rounded-md">⭐ {movie.vote_average.toFixed(1)}</span>
            <span>{movie.release_date}</span>
            <span>{movie.runtime}분</span>
            {director && <span>감독: {director.name}</span>}
          </div>

          <div className="flex gap-2 mb-6">
            {movie.genres.map((g) => (
              <span key={g.id} className="border border-gray-500 text-gray-300 px-3 py-1 rounded-full text-sm">
                {g.name}
              </span>
            ))}
          </div>

          <p className="text-gray-200 leading-relaxed max-w-3xl text-lg">
            {movie.overview || '등록된 줄거리가 없습니다.'}
          </p>
        </div>
      </div>

      
      <div className="relative z-10 container mx-auto px-6 mt-20">
        <h2 className="text-3xl font-bold mb-8">감독/출연</h2>
        <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide">
          {credits.cast.slice(0, 15).map((actor) => (
            <div key={actor.id} className="flex flex-col items-center min-w-[120px]">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-700 shadow-lg">
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                    사진 없음
                  </div>
                )}
              </div>
              <span className="font-bold text-center text-sm">{actor.name}</span>
              <span className="text-gray-400 text-xs text-center mt-1">{actor.character}역</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}