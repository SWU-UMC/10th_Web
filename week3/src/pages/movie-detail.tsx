import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const MovieDetailPage = () => {
    const { movieId } = useParams();

    const [movieDetails, setMovieDetails] = useState<any>(null);
    const [credits, setCredits] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const [detailsResponse, creditsResponse] = await Promise.all([
                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
                        }
                    }),
                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
                        }
                    })
                ]);
                setMovieDetails(detailsResponse.data);
                setCredits(creditsResponse.data);
            } catch (error) {
                console.error("영화 상세 정보 로딩 실패", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    if (isLoading) return <div className="bg-black min-h-screen flex justify-center items-center text-white">로딩 중...</div>;

    return (
        <div className="bg-black min-h-screen text-white">
        {/* 상단 배너 섹션 */}
        <div 
            className="relative h-[500px] bg-cover bg-center"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetails?.backdrop_path})` }}
        >
            <div className="absolute inset-0 bg-black/60 p-10 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-2">{movieDetails?.title}</h1>
            <p className="text-lg text-gray-300 mb-1">평균 {movieDetails?.vote_average.toFixed(1)}</p>
            <p className="text-lg text-gray-300 mb-1">{movieDetails?.release_date.split('-')[0]}</p>
            <p className="text-lg text-gray-300 mb-4">{movieDetails?.runtime}분</p>
            <p className="italic text-xl mb-4">"{movieDetails?.tagline}"</p>
            <p className="max-w-2xl text-base leading-relaxed">{movieDetails?.overview}</p>
            </div>
        </div>

        {/* 하단 출연진 섹션 */}
        <div className="p-10">
            <h2 className="text-2xl font-bold mb-8">감독/출연</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {credits?.cast.slice(0, 10).map((person: any) => (
                <div key={person.id} className="text-center">
                <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden border-2 border-gray-700">
                    <img 
                    src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : '기본이미지URL'} 
                    className="w-full h-full object-cover"
                    />
                </div>
                <p className="text-xs font-bold truncate">{person.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{person.character}</p>
                </div>
            ))}
            </div>
        </div>
        </div>
    )

}

export default MovieDetailPage;