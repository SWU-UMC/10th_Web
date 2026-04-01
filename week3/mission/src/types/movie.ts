export type Movie = {
adult: boolean;
backdrop_path: string;
genre_ids: number[];
id: number;
original_language: string;
original_title: string;
overview: string;
popularity: number;
poster_path: string;
release_date: string;
title: string;
video: boolean;
vote_average: number;
vote_count: number;
};

export type MovieResponse = {
page: number;
results: Movie[];
total_pages: number;
total_results: number;
};

// 영화 상세 정보
export type MovieDetail = Movie & {
  budget: number;
  genres: Array<{ id: number; name: string }>;
  homepage: string;
  imdb_id: string;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
};

// 출연진 타입
export type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};

// 제작진 타입
export type Crew = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
};

// 크레딧 응답
export type Credits = {
  cast: Cast[];
  crew: Crew[];
};