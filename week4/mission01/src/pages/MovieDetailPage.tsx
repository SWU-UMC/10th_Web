import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from "axios";
import type { MovieDetail, MovieCreditsResponse } from '../types/movie';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function MovieDetailPage() {
    const { movieId } = useParams<{ movieId: string }>();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [credits, setCredits] = useState<MovieCreditsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                setLoading(true);
                setIsError(false);

                const config = {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                };

                // 상세 정보와 출연진 정보를 동시에 호출
                const [detailRes, creditsRes] = await Promise.all([
                    axios.get<MovieDetail>(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, config),
                    axios.get<MovieCreditsResponse>(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, config)
                ]);

                setMovie(detailRes.data);
                setCredits(creditsRes.data);
            } catch (error) {
                console.error("상세페이지 에러:", error);
                setIsError(true);
            } finally {
                setLoading(false);
            }
        };

        if (movieId) {
            fetchMovieData();
        }
    }, [movieId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <LoadingSpinner />
            </div>
        );
    }

    if (isError || !movie) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-10">
            {/* 상단 배너 */}
            <div className="relative h-[450px] rounded-3xl overflow-hidden mb-10 shadow-2xl">
                <img 
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
                    className="w-full h-full object-cover opacity-50"
                    alt="배경 이미지"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10">
                    <h1 className="text-5xl font-extrabold mb-4">{movie.title}</h1>
                    <p className="text-xl italic text-gray-300">{movie.tagline}</p>
                </div>
            </div>

            {/* 상세 내용 섹션 */}
            <div className="flex flex-col md:flex-row gap-12 max-w-7xl mx-auto">
                <div className="w-full md:w-1/3 flex-shrink-0">
                    <img 
                        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} 
                        className="w-full rounded-2xl shadow-lg border border-gray-800"
                        alt={movie.title}
                    />
                </div>
                
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="bg-yellow-500 text-black px-3 py-1 rounded-md font-bold">
                            ⭐ {movie.vote_average.toFixed(1)}
                        </span>
                        <span className="text-gray-400">{movie.release_date}</span>
                        <span className="text-gray-400">{movie.runtime}분</span>
                    </div>

                    <h2 className="text-2xl font-bold mb-4 border-l-4 border-[#dda5e3] pl-4">줄거리</h2>
                    <p className="text-lg text-gray-300 leading-relaxed mb-10">{movie.overview || "등록된 줄거리가 없습니다."}</p>

                    <h2 className="text-2xl font-bold mb-6 border-l-4 border-[#dda5e3] pl-4">출연진</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                        {credits?.cast.slice(0, 10).map((person) => (
                            <div key={person.id} className="group">
                                <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-900 border border-gray-800 transition-transform group-hover:scale-105">
                                    {person.profile_path ? (
                                        <img 
                                            src={`https://image.tmdb.org/t/p/original${person.profile_path}`} 
                                            className="w-full h-full object-cover"
                                            alt={person.name}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                                    )}
                                </div>
                                <p className="text-sm font-bold truncate">{person.name}</p>
                                <p className="text-xs text-gray-500 truncate">{person.character}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
