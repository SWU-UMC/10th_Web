
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { MovieDetail, Credits } from '../types/movie';
import { LoadingSpinner } from '../components/LoadingSpinner';

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) return;

      setIsPending(true);
      setIsError(false);

      try {
        const movieResponse = await axios.get<MovieDetail>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        const creditsResponse = await axios.get<Credits>(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setMovie(movieResponse.data);
        setCredits(creditsResponse.data);
      } catch (error) {
        console.error('영화 상세정보 로드 실패:', error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (isPending) {
    return (
      <div className='flex items-center justify-center h-dvh'>
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className='flex items-center justify-center h-dvh bg-gray-900'>
        <div className='text-center'>
          <p className='text-red-500 text-3xl font-bold mb-4'>
            영화 정보를 불러올 수 없습니다.
          </p>
          <p className='text-gray-400 mb-6'>다시 시도해주세요.</p>
          <button
            onClick={() => navigate(-1)}
            className='px-6 py-2 bg-[#b2dab1] text-gray-900 rounded-lg font-semibold hover:bg-[#dda5e3] transition-colors'
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  const director = credits?.crew.find((person) => person.job === 'Director');
  const topCast = credits?.cast.slice(0, 6) || [];

  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = (rating % 2) >= 1;
    
    return (
      <div className='flex gap-1'>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-2xl ${
              i < fullStars 
                ? 'text-yellow-400' 
                : i === fullStars && hasHalfStar
                ? 'text-yellow-400 opacity-50'
                : 'text-gray-600'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white'>
      {/* 배경 이미지 */}
      <div className='relative h-80 md:h-96 overflow-hidden'>
        {movie.backdrop_path ? (
          <div
            className='absolute inset-0 bg-cover bg-center'
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              filter: 'brightness(0.4)',
            }}
          />
        ) : (
          <div className='absolute inset-0 bg-gray-700' />
        )}
        <button
          onClick={() => navigate(-1)}
          className='absolute top-6 left-6 z-10 px-4 py-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors backdrop-blur-sm'
        >
          ← 뒤로
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-20'>
        {/* 포스터 + 기본 정보 */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
          {/* 포스터 */}
          <div className='flex justify-center md:justify-start'>
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
                className='rounded-xl shadow-2xl hover:shadow-3xl transition-shadow w-full md:w-auto max-w-xs'
              />
            ) : (
              <div className='w-full md:w-64 aspect-[2/3] bg-gray-700 rounded-xl flex items-center justify-center'>
                <p className='text-gray-400'>포스터 없음</p>
              </div>
            )}
          </div>

          {/* 상세 정보 */}
          <div className='md:col-span-2 space-y-6'>
            {/* 제목 */}
            <div>
              <h1 className='text-5xl md:text-6xl font-black mb-2 bg-gradient-to-r from-[#b2dab1] to-[#dda5e3] bg-clip-text text-transparent'>
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className='text-lg text-gray-400 italic font-light'>"{movie.tagline}"</p>
              )}
            </div>

            {/* 평점 및 기본 정보 */}
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                {renderStars(movie.vote_average)}
                <div>
                  <p className='text-3xl font-bold text-yellow-400'>
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className='text-gray-400 text-sm'>
                    ({movie.vote_count.toLocaleString()} 투표)
                  </p>
                </div>
              </div>
            </div>

            {/* 그리드 정보 */}
            <div className='grid grid-cols-2 gap-4 pt-4 border-t border-gray-700'>
              <div className='space-y-1'>
                <p className='text-gray-400 text-sm font-semibold uppercase'>개봉일</p>
                <p className='text-xl font-bold'>{movie.release_date}</p>
              </div>
              <div className='space-y-1'>
                <p className='text-gray-400 text-sm font-semibold uppercase'>상영시간</p>
                <p className='text-xl font-bold'>{movie.runtime}분</p>
              </div>
              <div className='space-y-1'>
                <p className='text-gray-400 text-sm font-semibold uppercase'>예산</p>
                <p className='text-xl font-bold'>
                  {movie.budget > 0 ? `$${(movie.budget / 1000000).toFixed(1)}M` : '정보 없음'}
                </p>
              </div>
              <div className='space-y-1'>
                <p className='text-gray-400 text-sm font-semibold uppercase'>수익</p>
                <p className='text-xl font-bold'>
                  {movie.revenue > 0 ? `$${(movie.revenue / 1000000).toFixed(1)}M` : '정보 없음'}
                </p>
              </div>
            </div>

            {/* 장르 */}
            {movie.genres && movie.genres.length > 0 && (
              <div className='pt-4 border-t border-gray-700'>
                <p className='text-gray-400 text-sm font-semibold uppercase mb-3'>장르</p>
                <div className='flex flex-wrap gap-2'>
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className='px-4 py-2 bg-gradient-to-r from-[#b2dab1]/30 to-[#dda5e3]/30 border border-[#b2dab1]/50 rounded-full text-sm font-medium hover:from-[#b2dab1]/50 hover:to-[#dda5e3]/50 transition-all'
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 감독 정보 */}
        {director && (
          <div className='mb-12'>
            <p className='text-gray-400 text-sm font-semibold uppercase mb-3'>감독</p>
            <div className='flex items-center gap-4'>
              <div className='w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0'>
                👤
              </div>
              <p className='text-2xl font-bold text-[#b2dab1]'>{director.name}</p>
            </div>
          </div>
        )}

        {/* 줄거리 */}
        <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-12'>
          <h2 className='text-2xl font-bold mb-4 uppercase tracking-wider'>줄거리</h2>
          <p className='text-gray-300 leading-relaxed text-lg'>{movie.overview}</p>
        </div>

        {/* 출연진 */}
        {topCast.length > 0 && (
          <div className='mb-12'>
            <h2 className='text-3xl font-bold mb-8 uppercase tracking-wider'>주요 출연진</h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
              {topCast.map((actor, index) => (
                <div
                  key={actor.id}
                  className='group animate-fade-in'
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className='relative overflow-hidden rounded-xl mb-3 bg-gray-700 aspect-[2/3]'>
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-gray-400'>
                        👤
                      </div>
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4'>
                      <p className='text-yellow-400 font-bold text-center px-2'>{actor.character}</p>
                    </div>
                  </div>
                  <h3 className='font-semibold text-center text-white group-hover:text-[#b2dab1] transition-colors'>
                    {actor.name}
                  </h3>
                  <p className='text-gray-400 text-xs text-center'>{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 추가 제작진 */}
        {credits && credits.crew.length > 1 && (
          <div className='mb-12'>
            <h2 className='text-2xl font-bold mb-6 uppercase tracking-wider'>제작진</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {credits.crew
                .filter(
                  (person, index, self) =>
                    ['Director', 'Producer', 'Writer', 'Cinematography', 'Music'].includes(
                      person.job
                    ) && self.findIndex((p) => p.id === person.id) === index
                )
                .slice(0, 9)
                .map((person) => (
                  <div key={person.id} className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0'>
                      👤
                    </div>
                    <div className='min-w-0'>
                      <p className='font-semibold text-white truncate'>{person.name}</p>
                      <p className='text-xs text-gray-400 truncate'>{person.job}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MovieDetailPage;