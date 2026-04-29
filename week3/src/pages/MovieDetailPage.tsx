import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// types/movie.ts에 정의한 타입들을 불러옵니다.
import type { MovieDetail, Cast, CreditsResponse } from '../types/movie';

const MovieDetailPage = () => {
    // 1. useParams를 통해 URL의 :movieId 값을 가져옵니다.
    const { movieId } = useParams<{ movieId: string }>();

    // 상태 관리
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [cast, setCast] = useState<Cast[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMovieData = async (): Promise<void> => {
            // movieId가 없을 경우를 대비한 방어 코드
            if (!movieId) return;

            setIsPending(true);
            setIsError(false);

            try {
                // 2. 가져온 movieId를 사용하여 상세 정보와 출연진 데이터를 각각 요청 (병렬 처리)
                const [movieRes, creditsRes] = await Promise.all([
                    axios.get<MovieDetail>(
                        `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
                        {
                            headers: {
                                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                            },
                        }
                    ),
                    axios.get<CreditsResponse>(
                        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
                        {
                            headers: {
                                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                            },
                        }
                    )
                ]);

                // 데이터 저장
                setMovie(movieRes.data);
                setCast(creditsRes.data.cast);
            } catch (error) {
                console.error("Data Fetching Error:", error);
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchMovieData();
    }, [movieId]); // 3. movieId가 바뀔 때마다 데이터를 새로 호출합니다.

    // 로딩 상태 처리
    if (isPending) {
        return <div className="bg-black min-h-screen text-white p-10">로딩 중...</div>;
    }

    // 에러 상태 처리
    if (isError) {
        return (
            <div className="bg-black min-h-screen flex items-center justify-center">
                <span className='text-red-500 text-2xl font-bold'>에러가 발생했습니다.</span>
            </div>
        );
    }

    // 데이터가 없을 경우 처리
    if (!movie) return null;

    return (
        <div className="bg-black text-white min-h-screen">
            {/* 상단 섹션 (이미지 레이아웃 참조) */}
            <div 
                className="relative h-[500px] w-full bg-cover bg-center"
                style={{ 
                    backgroundImage: `linear-gradient(to right, black 20%, transparent 80%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` 
                }}
            >
                <div className="absolute inset-0 p-12 flex flex-col justify-center max-w-4xl">
                    <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                    <div className="flex gap-4 mb-2 text-lg">
                        <span>평점 {movie.vote_average.toFixed(1)}</span>
                        <span>{movie.release_date.split('-')[0]}</span>
                        <span>{movie.runtime}분</span>
                    </div>
                    <p className="text-xl font-medium text-yellow-400 mb-4">{movie.tagline}</p>
                    <p className="text-gray-300 leading-relaxed max-w-2xl">{movie.overview}</p>
                </div>
            </div>

            {/* 출연진 섹션 */}
            <div className="p-12">
                <h2 className="text-2xl font-bold mb-8">감독/출연</h2>
                <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
                    {cast.map((person) => (
                        <div key={person.id} className="min-w-[120px] text-center">
                            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-gray-800 mb-2">
                                <img 
                                    src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : 'https://via.placeholder.com/200'} 
                                    alt={person.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="font-bold text-sm truncate">{person.name}</p>
                            <p className="text-xs text-gray-500 truncate">{person.character}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;