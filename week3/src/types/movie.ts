export type Movie ={
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
// 2. 영화 상세 정보를 위한 타입 (Movie 타입을 확장)
// 상세 페이지 API는 genre_ids 대신 실제 genres 객체 배열과 runtime, tagline 등을 추가로 줍니다.
export interface MovieDetail extends Omit<Movie, 'genre_ids'> {
    genres: { id: number; name: string }[];
    runtime: number;
    tagline: string;
    status: string;
    revenue: number;
    budget: number;
}

// 3. 출연진(Cast) 정보를 위한 타입
export type Cast = {
    id: number;
    gender: number;
    name: string;                // 배우 이름
    original_name: string;
    character: string;           // 극 중 역할 이름
    profile_path: string | null; // 배우 사진 (없을 수 있으므로 null 허용)
    cast_id: number;
    order: number;               // 출연 순서
};

// 4. Credits API 응답 전체 타입
export type CreditsResponse = {
    id: number;
    cast: Cast[];                // 배우 리스트
    crew: any[];                 // 제작진 리스트 (감독 등)
};

export type MovieResponse = {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
};