export interface Movie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}


export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetail extends Movie {
  backdrop_path: string | null; // null 가능성 추가해주면 더 안전해
  runtime: number;
  genres: Genre[];
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface MovieCredits {
  cast: Cast[];
  crew: Crew[];
}