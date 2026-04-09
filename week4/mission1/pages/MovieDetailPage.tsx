import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

type MovieDetail = {
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
};

type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string;
};

export default function MovieDetailPage() {
  const { movieId } = useParams();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const detailRes = await axios(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        const creditRes = await axios(
          `https://api.themoviedb.org/3/movie/${movieId}/credits`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setMovie(detailRes.data);
        setCast(creditRes.data.cast.slice(0, 10)); // 상위 10명만
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [movieId]);

  if (!movie) return <div className="text-white p-10">로딩중...</div>;

  return (
    <div className="text-white p-10">
      {/* 상단 */}
      <div className="flex gap-10">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          className="w-64 rounded-xl"
        />

        <div>
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          <p className="mb-2">⭐ {movie.vote_average}</p>
          <p className="text-gray-300">{movie.overview}</p>
        </div>
      </div>

      {/* 출연진 */}
      <h2 className="text-2xl mt-10 mb-4">출연진</h2>

      <div className="grid grid-cols-5 gap-4">
        {cast.map((actor) => (
          <div key={actor.id} className="text-center">
            <img
              src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
              className="rounded-lg mb-2"
            />
            <p className="text-sm">{actor.name}</p>
            <p className="text-xs text-gray-400">
              {actor.character}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}