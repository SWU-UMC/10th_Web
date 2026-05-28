
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
}


export type MovieResponse = {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export interface MovieDetail extends Omit<Movie, 'genre_ids'> {
    belongs_to_collection: {
        id: number;
        name: string;
        poster_path: string;
        backdrop_path: string;
    } | null;
    budget: number;
    genres: {
        id: number;
        name: string;
    }[];
    homepage: string;
    imdb_id: string;
    origin_country: string[];
    production_companies: {
        id: number;
        logo_path: string | null;
        name: string;
        origin_country: string;
    }[];
    revenue: number;
    runtime: number;
    status: string;
    tagline: string;
}

export interface Cast {
    id: number;
    name: string;
    original_name: string;
    character: string;
    profile_path: string | null;
    known_for_department: string;
}

export interface Crew {
    id: number;
    name: string;
    job: string;
    department: string;
}

export interface MovieCreditsResponse {
    id: number;
    cast: Cast[];
    crew: Crew[];
}
