interface ImportMetaEnv {
    readonly VITE_TMDB_KEY: string; // 환경변수 타입 정의
}

interface ImportMeta {
    readonly env: ImportMetaEnv; // import.meta.env 타입 정의
}