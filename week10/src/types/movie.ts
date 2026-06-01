export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  adult: boolean;
  original_language: string;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export type MovieLanguage = 'ko-KR' | 'en-US' | 'ja-JP';

export interface MovieFilters {
  query: string;
  include_adult: boolean;
  language: MovieLanguage;
}